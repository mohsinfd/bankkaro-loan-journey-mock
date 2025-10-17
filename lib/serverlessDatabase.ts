import { 
  getLatestScrubData, 
  getAllLenderRules, 
  getPreApprovedOffers, 
  getUserScenario, 
  getAllUserScenarios,
  ScrubData,
  LenderRule,
  PreApprovedOffer
} from './mockData';

interface BREGate {
  name: string;
  passed: boolean;
  description: string;
  reason: string | null;
}

interface LenderEvaluation {
  lender_id: string;
  lender_name: string;
  eligible: boolean;
  preapproved: boolean;
  roi: number | null;
  max_amount: number | null;
  processing_fee: number | null;
  tenure_available: number[];
  approval_probability: number;
  badge: string;
  reason: string | null;
  icon: string;
  color: string;
  features: string[];
  gates: BREGate[];
  reason_codes: string[];
  pa_override: boolean;
}

export default class ServerlessDatabaseService {
  
  // Get latest scrub data for a phone number
  getLatestScrubData(telephone: string): ScrubData | null {
    return getLatestScrubData(telephone);
  }

  // Get all lender rules
  getAllLenderRules(): LenderRule[] {
    return getAllLenderRules();
  }

  // Get pre-approved offers for a phone number
  getPreApprovedOffers(telephone: string): PreApprovedOffer[] {
    return getPreApprovedOffers(telephone);
  }

  // Get user scenario by ID
  getUserScenario(scenarioId: string) {
    return getUserScenario(scenarioId);
  }

  // Get all user scenarios
  getAllUserScenarios() {
    return getAllUserScenarios();
  }

  // BRE Evaluation Logic
  evaluateLender(scrubData: ScrubData, lender: LenderRule, paOffer: PreApprovedOffer | null = null): LenderEvaluation {
    const gates: BREGate[] = [];
    const reasonCodes: string[] = [];
    
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
        scrubData.score || 0, 
        lender.min_score,
        `Credit score: ${scrubData.score} ${(scrubData.score || 0) >= lender.min_score ? '≥' : '<'} ${lender.min_score} required`
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
  evaluateGate(name: string, value: number, threshold: number, description: string): BREGate {
    const passed = value >= threshold;
    return {
      name,
      passed,
      description,
      reason: passed ? null : `${name} below threshold`
    };
  }

  // Dummy close method for compatibility
  close(): void {
    // No-op for serverless environment
  }
}
