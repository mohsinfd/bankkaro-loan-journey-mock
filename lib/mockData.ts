// Mock data for serverless deployment (Vercel-compatible)
// This replaces the SQLite database for deployment environments

export interface ScrubData {
  memberreference: string;
  telephone: string;
  process_date: string;
  score: number | null;
  income: number;
  monthly_annual_indicator: string;
  dpd_l12m: number;
  total_enquiries_3m: number;
  total_enquiries_6m: number;
  pincode: string;
  city: string;
  state: string;
  employment_type: string;
  age: number;
  credit_history_length: number;
  active_loans: number;
  loan_amount: number;
  emi_ratio: number;
  bureau_updated: boolean;
  data_quality: string;
  user_tag: string;
  // Loan intent fields (added by user input)
  desired_amount?: number;
  desired_tenure_months?: number;
  // Derived fields
  freshness_ok: boolean;
  days_since_process: number;
  ntc_flag: boolean;
  any_dpd_12m: boolean;
  high_enq_3m: boolean;
  foir_current: number;
  income_monthly: number;
  risk_band: string;
}

export interface LenderRule {
  lender_id: string;
  lender_name: string;
  accepts_ntc: boolean;
  min_score: number;
  min_income: number;
  dpd_allowed_12m: number;
  enquiries_3m_cap: number;
  foir_cap: number;
  amount_min: number;
  amount_max: number;
  tenure_min: number;
  tenure_max: number;
  roi_min: number;
  roi_max: number;
  priority: number;
  icon: string;
  color: string;
  employment_types?: string[];
}

export interface PreApprovedOffer {
  telephone: string;
  lender_id: string;
  amount: number;
  roi: number;
  processing_fee: number;
  tenure_months: number[];
  approval_probability: number;
  features: string[];
  valid_until: string;
}

// Mock scrub data
const scrubDataMap: Record<string, Omit<ScrubData, 'freshness_ok' | 'days_since_process' | 'ntc_flag' | 'any_dpd_12m' | 'high_enq_3m' | 'foir_current' | 'income_monthly' | 'risk_band'>> = {
  '+919812345678': {
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
  '+919811234567': {
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
  '+919876543210': {
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
  '+919812367890': {
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
  '+919876512345': {
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
  '+919867890123': {
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
};

// Mock lender rules
const lenderRules: LenderRule[] = [
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
    color: '#2563eb',
    employment_types: ['Salaried', 'Self-Employed']
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
    color: '#dc2626',
    employment_types: ['Salaried']
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
    color: '#059669',
    employment_types: ['Salaried']
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
    color: '#7c3aed',
    employment_types: ['Salaried', 'Self-Employed']
  },
  {
    lender_id: 'kotak_mahindra',
    lender_name: 'Kotak Mahindra Bank',
    accepts_ntc: false,
    min_score: 740,
    min_income: 35000,
    dpd_allowed_12m: 0,
    enquiries_3m_cap: 3,
    foir_cap: 0.55,
    amount_min: 75000,
    amount_max: 750000,
    tenure_min: 12,
    tenure_max: 72,
    roi_min: 11,
    roi_max: 18,
    priority: 8,
    icon: 'kotak',
    color: '#f59e0b',
    employment_types: ['Salaried']
  },
  {
    lender_id: 'axis_bank',
    lender_name: 'Axis Bank',
    accepts_ntc: false,
    min_score: 730,
    min_income: 30000,
    dpd_allowed_12m: 0,
    enquiries_3m_cap: 3,
    foir_cap: 0.62,
    amount_min: 60000,
    amount_max: 600000,
    tenure_min: 12,
    tenure_max: 84,
    roi_min: 12,
    roi_max: 19,
    priority: 12,
    icon: 'axis',
    color: '#ef4444',
    employment_types: ['Salaried']
  },
  {
    lender_id: 'flexi_loans',
    lender_name: 'Flexi Loans',
    accepts_ntc: true,
    min_score: 680,
    min_income: 15000,
    dpd_allowed_12m: 2,
    enquiries_3m_cap: 8,
    foir_cap: 0.75,
    amount_min: 5000,
    amount_max: 150000,
    tenure_min: 6,
    tenure_max: 36,
    roi_min: 18,
    roi_max: 30,
    priority: 25,
    icon: 'flexi',
    color: '#10b981',
    employment_types: ['Salaried', 'Self-Employed', 'Business']
  }
];

// Mock pre-approved offers
const preapprovedOffers: PreApprovedOffer[] = [
  {
    telephone: '+919867890123',
    lender_id: 'fibe_nbfc',
    amount: 250000,
    roi: 12,
    processing_fee: 5000,
    tenure_months: [12, 24, 36, 48],
    approval_probability: 95,
    features: ['Guaranteed approval', 'No documentation', 'Instant disbursement'],
    valid_until: '2025-12-31'
  },
  {
    telephone: '+919867890123',
    lender_id: 'bajaj_finserv',
    amount: 300000,
    roi: 13,
    processing_fee: 7500,
    tenure_months: [12, 24, 36, 48, 60],
    approval_probability: 90,
    features: ['Pre-approved offer', 'Competitive rates', 'Flexible tenure'],
    valid_until: '2025-12-31'
  },
  {
    telephone: '+919812345678',
    lender_id: 'fibe_nbfc',
    amount: 200000,
    roi: 14,
    processing_fee: 4000,
    tenure_months: [12, 24, 36],
    approval_probability: 85,
    features: ['Quick approval', 'Low processing fee'],
    valid_until: '2025-12-31'
  }
];

// Helper functions
export function calculateRiskBand(score: number | null): string {
  if (!score || score === 0) return 'NTC';
  if (score >= 750) return '750+';
  if (score >= 700) return '700-749';
  if (score >= 650) return '650-699';
  if (score >= 600) return '600-649';
  return 'Below 600';
}

export function getLatestScrubData(telephone: string): ScrubData | null {
  const baseData = scrubDataMap[telephone];
  if (!baseData) return null;

  // Calculate derived fields
  const today = new Date();
  const processDate = new Date(baseData.process_date);
  const daysSinceProcess = Math.floor((today.getTime() - processDate.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    ...baseData,
    freshness_ok: daysSinceProcess <= 90,
    days_since_process: daysSinceProcess,
    ntc_flag: !baseData.score || baseData.score === 0,
    any_dpd_12m: baseData.dpd_l12m > 0,
    high_enq_3m: baseData.total_enquiries_3m > 5,
    foir_current: baseData.emi_ratio || 0,
    income_monthly: baseData.monthly_annual_indicator === 'A' ? baseData.income / 12 : baseData.income,
    risk_band: calculateRiskBand(baseData.score)
  };
}

export function getAllLenderRules(): LenderRule[] {
  return lenderRules;
}

export function getPreApprovedOffers(telephone: string): PreApprovedOffer[] {
  return preapprovedOffers.filter(offer => 
    offer.telephone === telephone && 
    new Date(offer.valid_until) >= new Date()
  );
}

export function getUserScenario(scenarioId: string) {
  const scenarios = [
    { id: 'scenario_a', name: 'Rohit Sharma', telephone: '+919812345678', scenario_description: 'PQ Success – clean profile', expected_outcome: '3+ eligible lenders, all PQ offers' },
    { id: 'scenario_b', name: 'Anita Desai', telephone: '+919811234567', scenario_description: 'PQ Fail – low score & DPD', expected_outcome: '0 eligible lenders, multiple failure reasons' },
    { id: 'scenario_c', name: 'Mohammed Iqbal', telephone: '+919876543210', scenario_description: 'PQ Fail – high enquiries', expected_outcome: 'Limited eligible lenders due to enquiry limits' },
    { id: 'scenario_d', name: 'Leena Kapoor', telephone: '+919812367890', scenario_description: 'Stale Scrub (>90d)', expected_outcome: 'Offers shown but greyed out with stale data warning' },
    { id: 'scenario_e', name: 'Vikas Jain', telephone: '+919876512345', scenario_description: 'NTC user (no score)', expected_outcome: 'Only NTC-accepting lenders eligible' },
    { id: 'scenario_f', name: 'Sneha Patel', telephone: '+919867890123', scenario_description: 'Pre-Approved candidate', expected_outcome: '2+ Pre-Approved offers + PQ offers' }
  ];
  
  return scenarios.find(s => s.id === scenarioId) || null;
}

export function getAllUserScenarios() {
  return [
    { id: 'scenario_a', name: 'Rohit Sharma', telephone: '+919812345678', scenario_description: 'PQ Success – clean profile', expected_outcome: '3+ eligible lenders, all PQ offers' },
    { id: 'scenario_b', name: 'Anita Desai', telephone: '+919811234567', scenario_description: 'PQ Fail – low score & DPD', expected_outcome: '0 eligible lenders, multiple failure reasons' },
    { id: 'scenario_c', name: 'Mohammed Iqbal', telephone: '+919876543210', scenario_description: 'PQ Fail – high enquiries', expected_outcome: 'Limited eligible lenders due to enquiry limits' },
    { id: 'scenario_d', name: 'Leena Kapoor', telephone: '+919812367890', scenario_description: 'Stale Scrub (>90d)', expected_outcome: 'Offers shown but greyed out with stale data warning' },
    { id: 'scenario_e', name: 'Vikas Jain', telephone: '+919876512345', scenario_description: 'NTC user (no score)', expected_outcome: 'Only NTC-accepting lenders eligible' },
    { id: 'scenario_f', name: 'Sneha Patel', telephone: '+919867890123', scenario_description: 'Pre-Approved candidate', expected_outcome: '2+ Pre-Approved offers + PQ offers' }
  ];
}
