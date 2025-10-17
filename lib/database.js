const Database = require('better-sqlite3');
const path = require('path');

class DatabaseService {
  constructor() {
    const dbPath = path.join(process.cwd(), 'database', 'bankkaro_mock.db');
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
  }

  // Get latest scrub data for a phone number
  getLatestScrubData(telephone) {
    const stmt = this.db.prepare(`
      SELECT * FROM scrub_base 
      WHERE telephone = ? 
      ORDER BY process_date DESC 
      LIMIT 1
    `);
    
    const result = stmt.get(telephone);
    
    if (!result) {
      return null;
    }

    // Calculate derived fields
    const today = new Date();
    const processDate = new Date(result.process_date);
    const daysSinceProcess = Math.floor((today - processDate) / (1000 * 60 * 60 * 24));
    
    return {
      ...result,
      // Derived fields
      freshness_ok: daysSinceProcess <= 90,
      days_since_process: daysSinceProcess,
      ntc_flag: !result.score || result.score === 0,
      any_dpd_12m: result.dpd_l12m > 0,
      high_enq_3m: result.total_enquiries_3m > 5, // Global cap
      foir_current: result.emi_ratio || 0,
      income_monthly: result.monthly_annual_indicator === 'A' ? result.income / 12 : result.income,
      risk_band: this.calculateRiskBand(result.score)
    };
  }

  // Calculate risk band based on score
  calculateRiskBand(score) {
    if (!score || score === 0) return 'NTC';
    if (score >= 750) return '750+';
    if (score >= 700) return '700-749';
    if (score >= 650) return '650-699';
    if (score >= 600) return '600-649';
    return 'Below 600';
  }

  // Get all lender rules
  getAllLenderRules() {
    const stmt = this.db.prepare(`
      SELECT * FROM lender_rules 
      ORDER BY priority ASC
    `);
    
    return stmt.all();
  }

  // Get pre-approved offers for a phone number
  getPreApprovedOffers(telephone) {
    const stmt = this.db.prepare(`
      SELECT * FROM preapproved_offers 
      WHERE telephone = ? AND valid_until >= date('now')
      ORDER BY roi ASC
    `);
    
    const results = stmt.all(telephone);
    
    // Parse JSON fields
    return results.map(offer => ({
      ...offer,
      tenure_months: JSON.parse(offer.tenure_months),
      features: JSON.parse(offer.features)
    }));
  }

  // Cache offer computation result
  cacheOfferResult(bkUserId, telephone, lenderId, eligible, preapproved, reasonCodes, offerData) {
    const stmt = this.db.prepare(`
      INSERT INTO prequal_offer_cache (
        bk_user_id, telephone, lender_id, eligible, preapproved, 
        reason_codes, offer_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      bkUserId, telephone, lenderId, eligible, preapproved,
      JSON.stringify(reasonCodes), JSON.stringify(offerData)
    );
  }

  // Get user scenario by ID
  getUserScenario(scenarioId) {
    const stmt = this.db.prepare(`
      SELECT * FROM user_scenarios WHERE id = ?
    `);
    
    return stmt.get(scenarioId);
  }

  // Get all user scenarios
  getAllUserScenarios() {
    const stmt = this.db.prepare(`
      SELECT * FROM user_scenarios ORDER BY id
    `);
    
    return stmt.all();
  }

  // BRE Evaluation Logic
  evaluateLender(scrubData, lender, paOffer = null) {
    const gates = [];
    const reasonCodes = [];
    
    // Check for Pre-Approved override first
    if (paOffer) {
      return {
        lender_id: lender.lender_id,
        lender_name: lender.lender_name,
        eligible: true,
        preapproved: true,
        roi: paOffer.roi,
        max_amount: paOffer.amount,
        processing_fee: paOffer.processing_fee,
        tenure_available: paOffer.tenure_months,
        approval_probability: paOffer.approval_probability,
        badge: "Pre-Approved",
        reason: null,
        icon: lender.icon,
        color: lender.color,
        features: paOffer.features,
        gates: [{
          name: "PA Override",
          passed: true,
          description: "Pre-approved offer bypasses BRE evaluation",
          reason: null
        }],
        reason_codes: [],
        pa_override: true
      };
    }

    // Gate 1: Freshness Check
    const freshnessGate = this.evaluateGate(
      "Freshness Check", 
      scrubData.freshness_ok ? 1 : 0, 
      1,
      `Data freshness: ${scrubData.days_since_process} days old ${scrubData.freshness_ok ? '≤' : '>'} 90 days`
    );
    gates.push(freshnessGate);
    if (!freshnessGate.passed) reasonCodes.push("STALE_SCRUB");

    // Gate 2: NTC Check
    if (scrubData.ntc_flag && !lender.accepts_ntc) {
      const ntcGate = this.evaluateGate("NTC Check", 0, 1, "NTC user but lender doesn't accept NTC");
      gates.push(ntcGate);
      reasonCodes.push("NTC_NOT_ACCEPTED");
    } else if (scrubData.ntc_flag && lender.accepts_ntc) {
      const ntcGate = this.evaluateGate("NTC Check", 1, 1, "NTC user and lender accepts NTC");
      gates.push(ntcGate);
    }

    // Gate 3: Score Check (skip for NTC users if lender accepts NTC)
    if (!scrubData.ntc_flag || !lender.accepts_ntc) {
      const scoreGate = this.evaluateGate(
        "Score Check", 
        scrubData.score, 
        lender.min_score,
        `Credit score: ${scrubData.score} ${scrubData.score >= lender.min_score ? '≥' : '<'} ${lender.min_score} required`
      );
      gates.push(scoreGate);
      if (!scoreGate.passed) reasonCodes.push("LOW_SCORE");
    }

    // Gate 4: DPD Check
    const dpdGate = this.evaluateGate(
      "DPD Check", 
      scrubData.dpd_l12m <= lender.dpd_allowed_12m ? 1 : 0, 
      1,
      `DPD: ${scrubData.dpd_l12m} days past due ${scrubData.dpd_l12m <= lender.dpd_allowed_12m ? '≤' : '>'} ${lender.dpd_allowed_12m} allowed`
    );
    gates.push(dpdGate);
    if (!dpdGate.passed) reasonCodes.push("DPD_FAIL");

    // Gate 5: Enquiries Check
    const enquiriesGate = this.evaluateGate(
      "Enquiries Check", 
      scrubData.total_enquiries_3m <= lender.enquiries_3m_cap ? 1 : 0, 
      1,
      `Enquiries: ${scrubData.total_enquiries_3m} ${scrubData.total_enquiries_3m <= lender.enquiries_3m_cap ? '≤' : '>'} ${lender.enquiries_3m_cap} cap`
    );
    gates.push(enquiriesGate);
    if (!enquiriesGate.passed) reasonCodes.push("HIGH_ENQ_3M");

    // Gate 6: Income Check
    const incomeGate = this.evaluateGate(
      "Income Check", 
      scrubData.income_monthly, 
      lender.min_income,
      `Monthly income: ₹${scrubData.income_monthly.toLocaleString()} ${scrubData.income_monthly >= lender.min_income ? '≥' : '<'} ₹${lender.min_income.toLocaleString()} required`
    );
    gates.push(incomeGate);
    if (!incomeGate.passed) reasonCodes.push("LOW_INCOME");

    // Gate 7: FOIR Check
    const foirGate = this.evaluateGate(
      "FOIR Check", 
      scrubData.foir_current <= lender.foir_cap ? 1 : 0, 
      1,
      `FOIR: ${(scrubData.foir_current * 100).toFixed(1)}% ${scrubData.foir_current <= lender.foir_cap ? '≤' : '>'} ${(lender.foir_cap * 100).toFixed(1)}% cap`
    );
    gates.push(foirGate);
    if (!foirGate.passed) reasonCodes.push("FOIR_EXCEEDED");

    // Gate 8: Range Check (always passes for now)
    const rangeGate = this.evaluateGate("Range Check", 1, 1, "Loan amount and tenure within allowed ranges");
    gates.push(rangeGate);

    const allGatesPassed = gates.every(gate => gate.passed);

    return {
      lender_id: lender.lender_id,
      lender_name: lender.lender_name,
      eligible: allGatesPassed,
      preapproved: false,
      roi: allGatesPassed ? lender.roi_min + Math.floor(Math.random() * (lender.roi_max - lender.roi_min)) : null,
      max_amount: allGatesPassed ? Math.min(lender.amount_max, scrubData.income_monthly * 10) : null,
      processing_fee: allGatesPassed ? Math.round(lender.roi_min * scrubData.income_monthly / 100) : null,
      tenure_available: allGatesPassed ? Array.from({length: (lender.tenure_max - lender.tenure_min) / 12 + 1}, (_, i) => lender.tenure_min + (i * 12)) : [],
      approval_probability: allGatesPassed ? 70 + Math.floor(Math.random() * 25) : 0,
      badge: allGatesPassed ? "Pre-Qualified" : "Not Eligible",
      reason: allGatesPassed ? null : reasonCodes[0] || "Multiple criteria failed",
      icon: lender.icon,
      color: lender.color,
      features: allGatesPassed ? ["Quick approval", "Low documentation", "Flexible tenure"] : [],
      gates: gates,
      reason_codes: reasonCodes,
      pa_override: false
    };
  }

  // Helper function to evaluate individual gates
  evaluateGate(name, value, threshold, description) {
    const passed = value >= threshold;
    return {
      name,
      passed,
      description,
      reason: passed ? null : `${name} below threshold`
    };
  }

  // Close database connection
  close() {
    this.db.close();
  }
}

module.exports = DatabaseService;
