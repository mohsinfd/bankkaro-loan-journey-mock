const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Initialize SQLite database
const dbPath = path.join(__dirname, 'bankkaro_mock.db');
const db = new Database(dbPath);

// Read and execute schema
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

console.log('Initializing database...');
db.exec(schema);
console.log('Database schema created successfully');

// Seed data functions
function seedLenderRules() {
  console.log('Seeding lender rules...');
  
  const lenders = [
    {
      lender_id: 'fibe_nbfc',
      lender_name: 'Fibe',
      accepts_ntc: true,
      min_score: 700,
      min_income: 20000,
      dpd_allowed_12m: 1,
      enquiries_3m_cap: 6,
      foir_cap: 0.70,
      amount_min: 10000,
      amount_max: 200000,
      tenure_min: 6,
      tenure_max: 48,
      roi_min: 14,
      roi_max: 24,
      priority: 10,
      icon: 'fibe',
      color: '#2563eb'
    },
    {
      lender_id: 'lt_finance',
      lender_name: 'L&T Finance',
      accepts_ntc: false,
      min_score: 720,
      min_income: 25000,
      dpd_allowed_12m: 0,
      enquiries_3m_cap: 4,
      foir_cap: 0.65,
      amount_min: 50000,
      amount_max: 300000,
      tenure_min: 12,
      tenure_max: 60,
      roi_min: 13,
      roi_max: 22,
      priority: 20,
      icon: 'lt',
      color: '#dc2626'
    },
    {
      lender_id: 'hdfc_bank',
      lender_name: 'HDFC Bank',
      accepts_ntc: false,
      min_score: 750,
      min_income: 30000,
      dpd_allowed_12m: 0,
      enquiries_3m_cap: 2,
      foir_cap: 0.60,
      amount_min: 50000,
      amount_max: 500000,
      tenure_min: 12,
      tenure_max: 84,
      roi_min: 12,
      roi_max: 20,
      priority: 5,
      icon: 'hdfc',
      color: '#059669'
    },
    {
      lender_id: 'bajaj_finserv',
      lender_name: 'Bajaj Finserv',
      accepts_ntc: false,
      min_score: 720,
      min_income: 25000,
      dpd_allowed_12m: 1,
      enquiries_3m_cap: 4,
      foir_cap: 0.68,
      amount_min: 25000,
      amount_max: 400000,
      tenure_min: 12,
      tenure_max: 60,
      roi_min: 13,
      roi_max: 22,
      priority: 15,
      icon: 'bajaj',
      color: '#7c3aed'
    }
  ];

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO lender_rules (
      lender_id, lender_name, accepts_ntc, min_score, min_income,
      dpd_allowed_12m, enquiries_3m_cap, foir_cap, amount_min, amount_max,
      tenure_min, tenure_max, roi_min, roi_max, priority, icon, color
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  lenders.forEach(lender => {
    stmt.run(
      lender.lender_id, lender.lender_name, lender.accepts_ntc ? 1 : 0,
      lender.min_score, lender.min_income, lender.dpd_allowed_12m,
      lender.enquiries_3m_cap, lender.foir_cap, lender.amount_min,
      lender.amount_max, lender.tenure_min, lender.tenure_max,
      lender.roi_min, lender.roi_max, lender.priority,
      lender.icon, lender.color
    );
  });

  console.log(`Seeded ${lenders.length} lender rules`);
}

function seedScrubData() {
  console.log('Seeding scrub data...');
  
  // Realistic scrub data from your dataset
  const scrubData = [
    {
      memberreference: 'MBR001',
      telephone: '+919812345678',
      process_date: '2025-09-10',
      score: 785,
      income: 60000,
      monthly_annual_indicator: 'M',
      dpd_l12m: 0,
      total_enquiries_3m: 2,
      total_enquiries_6m: 4,
      pincode: '122001',
      city: 'Gurgaon',
      state: 'Haryana',
      employment_type: 'Salaried',
      age: 32,
      credit_history_length: 8,
      active_loans: 1,
      loan_amount: 200000,
      emi_ratio: 0.25,
      bureau_updated: true,
      data_quality: 'Excellent',
      user_tag: '785_clean_profile'
    },
    {
      memberreference: 'MBR002',
      telephone: '+919811234567',
      process_date: '2025-08-05',
      score: 645,
      income: 40000,
      monthly_annual_indicator: 'M',
      dpd_l12m: 2,
      total_enquiries_3m: 5,
      total_enquiries_6m: 8,
      pincode: '110030',
      city: 'New Delhi',
      state: 'Delhi',
      employment_type: 'Salaried',
      age: 28,
      credit_history_length: 5,
      active_loans: 2,
      loan_amount: 150000,
      emi_ratio: 0.45,
      bureau_updated: true,
      data_quality: 'Fair',
      user_tag: '645_dpd_enquiries'
    },
    {
      memberreference: 'MBR003',
      telephone: '+919876543210',
      process_date: '2025-06-20',
      score: 720,
      income: 25000,
      monthly_annual_indicator: 'M',
      dpd_l12m: 0,
      total_enquiries_3m: 8,
      total_enquiries_6m: 12,
      pincode: '560001',
      city: 'Bangalore',
      state: 'Karnataka',
      employment_type: 'Self-Employed',
      age: 35,
      credit_history_length: 6,
      active_loans: 1,
      loan_amount: 100000,
      emi_ratio: 0.30,
      bureau_updated: true,
      data_quality: 'Good',
      user_tag: '720_high_enquiries'
    },
    {
      memberreference: 'MBR004',
      telephone: '+919812367890',
      process_date: '2025-04-25',
      score: 710,
      income: 48000,
      monthly_annual_indicator: 'M',
      dpd_l12m: 0,
      total_enquiries_3m: 1,
      total_enquiries_6m: 2,
      pincode: '400001',
      city: 'Mumbai',
      state: 'Maharashtra',
      employment_type: 'Salaried',
      age: 30,
      credit_history_length: 7,
      active_loans: 1,
      loan_amount: 180000,
      emi_ratio: 0.28,
      bureau_updated: false,
      data_quality: 'Good',
      user_tag: '710_stale_data'
    },
    {
      memberreference: 'MBR005',
      telephone: '+919876512345',
      process_date: '2025-09-14',
      score: null,
      income: 30000,
      monthly_annual_indicator: 'M',
      dpd_l12m: 0,
      total_enquiries_3m: 2,
      total_enquiries_6m: 3,
      pincode: '302020',
      city: 'Jaipur',
      state: 'Rajasthan',
      employment_type: 'Salaried',
      age: 26,
      credit_history_length: 3,
      active_loans: 0,
      loan_amount: 0,
      emi_ratio: 0,
      bureau_updated: true,
      data_quality: 'Limited',
      user_tag: 'NTC_new_to_credit'
    },
    {
      memberreference: 'MBR006',
      telephone: '+919867890123',
      process_date: '2025-09-12',
      score: 760,
      income: 80000,
      monthly_annual_indicator: 'M',
      dpd_l12m: 0,
      total_enquiries_3m: 1,
      total_enquiries_6m: 2,
      pincode: '122018',
      city: 'Gurgaon',
      state: 'Haryana',
      employment_type: 'Salaried',
      age: 38,
      credit_history_length: 12,
      active_loans: 1,
      loan_amount: 350000,
      emi_ratio: 0.20,
      bureau_updated: true,
      data_quality: 'Excellent',
      user_tag: '760_preapproved_candidate'
    }
  ];

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO scrub_base (
      memberreference, telephone, process_date, score, income, monthly_annual_indicator,
      dpd_l12m, total_enquiries_3m, total_enquiries_6m, pincode, city, state,
      employment_type, age, credit_history_length, active_loans, loan_amount,
      emi_ratio, bureau_updated, data_quality, user_tag
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  scrubData.forEach(record => {
    stmt.run(
      record.memberreference, record.telephone, record.process_date,
      record.score, record.income, record.monthly_annual_indicator,
      record.dpd_l12m, record.total_enquiries_3m, record.total_enquiries_6m,
      record.pincode, record.city, record.state, record.employment_type,
      record.age, record.credit_history_length, record.active_loans,
      record.loan_amount, record.emi_ratio, record.bureau_updated ? 1 : 0,
      record.data_quality, record.user_tag
    );
  });

  console.log(`Seeded ${scrubData.length} scrub records`);
}

function seedPreApprovedOffers() {
  console.log('Seeding pre-approved offers...');
  
  const paOffers = [
    {
      telephone: '+919867890123',
      lender_id: 'fibe_nbfc',
      amount: 250000,
      roi: 12,
      processing_fee: 5000,
      tenure_months: JSON.stringify([12, 24, 36, 48]),
      approval_probability: 95,
      features: JSON.stringify(['Guaranteed approval', 'No documentation', 'Instant disbursement']),
      valid_until: '2025-12-31'
    },
    {
      telephone: '+919867890123',
      lender_id: 'bajaj_finserv',
      amount: 300000,
      roi: 13,
      processing_fee: 7500,
      tenure_months: JSON.stringify([12, 24, 36, 48, 60]),
      approval_probability: 90,
      features: JSON.stringify(['Pre-approved offer', 'Competitive rates', 'Flexible tenure']),
      valid_until: '2025-12-31'
    },
    {
      telephone: '+919812345678',
      lender_id: 'fibe_nbfc',
      amount: 200000,
      roi: 14,
      processing_fee: 4000,
      tenure_months: JSON.stringify([12, 24, 36]),
      approval_probability: 85,
      features: JSON.stringify(['Quick approval', 'Low processing fee']),
      valid_until: '2025-12-31'
    }
  ];

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO preapproved_offers (
      telephone, lender_id, amount, roi, processing_fee, tenure_months,
      approval_probability, features, valid_until
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  paOffers.forEach(offer => {
    stmt.run(
      offer.telephone, offer.lender_id, offer.amount, offer.roi,
      offer.processing_fee, offer.tenure_months, offer.approval_probability,
      offer.features, offer.valid_until
    );
  });

  console.log(`Seeded ${paOffers.length} pre-approved offers`);
}

function seedUserScenarios() {
  console.log('Seeding user scenarios...');
  
  const scenarios = [
    {
      id: 'scenario_a',
      name: 'Rohit Sharma',
      telephone: '+919812345678',
      scenario_description: 'PQ Success – clean profile with excellent score',
      expected_outcome: '3+ eligible lenders, all PQ offers'
    },
    {
      id: 'scenario_b',
      name: 'Anita Desai',
      telephone: '+919811234567',
      scenario_description: 'PQ Fail – low score & DPD issues',
      expected_outcome: '0 eligible lenders, multiple failure reasons'
    },
    {
      id: 'scenario_c',
      name: 'Mohammed Iqbal',
      telephone: '+919876543210',
      scenario_description: 'PQ Fail – high enquiries exceeding caps',
      expected_outcome: 'Limited eligible lenders due to enquiry limits'
    },
    {
      id: 'scenario_d',
      name: 'Leena Kapoor',
      telephone: '+919812367890',
      scenario_description: 'Stale Scrub (>90d) - greyed out offers',
      expected_outcome: 'Offers shown but greyed out with stale data warning'
    },
    {
      id: 'scenario_e',
      name: 'Vikas Jain',
      telephone: '+919876512345',
      scenario_description: 'NTC user (no score, test accepts_ntc)',
      expected_outcome: 'Only NTC-accepting lenders eligible'
    },
    {
      id: 'scenario_f',
      name: 'Sneha Patel',
      telephone: '+919867890123',
      scenario_description: 'Pre-Approved candidate with multiple PA offers',
      expected_outcome: '2+ Pre-Approved offers + PQ offers'
    }
  ];

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO user_scenarios (
      id, name, telephone, scenario_description, expected_outcome
    ) VALUES (?, ?, ?, ?, ?)
  `);

  scenarios.forEach(scenario => {
    stmt.run(
      scenario.id, scenario.name, scenario.telephone,
      scenario.scenario_description, scenario.expected_outcome
    );
  });

  console.log(`Seeded ${scenarios.length} user scenarios`);
}

// Main initialization
async function initializeDatabase() {
  try {
    console.log('🚀 Initializing BankKaro Mock Database...');
    
    seedLenderRules();
    seedScrubData();
    seedPreApprovedOffers();
    seedUserScenarios();
    
    console.log('✅ Database initialization completed successfully!');
    console.log(`📁 Database file: ${dbPath}`);
    
    // Close database connection
    db.close();
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase, db };
