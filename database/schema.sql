-- BankKaro Pre-Qualified Loan Journey Database Schema
-- SQLite compatible schema for mock implementation

-- 1) Raw scrub table (1 row per memberreference per process_date)
CREATE TABLE IF NOT EXISTS scrub_base (
  memberreference TEXT PRIMARY KEY,
  telephone TEXT NOT NULL,
  process_date DATE NOT NULL,
  score INTEGER,
  income NUMERIC,                  -- monthly if possible; if annual, store raw + flag
  monthly_annual_indicator TEXT,   -- 'M' or 'A' if present in your file
  dpd_l12m INTEGER,
  total_enquiries_3m INTEGER,
  total_enquiries_6m INTEGER,
  pincode TEXT,
  city TEXT,
  state TEXT,
  employment_type TEXT,            -- 'Salaried'/'Self-Employed'
  age INTEGER,
  credit_history_length INTEGER,
  active_loans INTEGER,
  loan_amount NUMERIC,
  emi_ratio NUMERIC,
  bureau_updated BOOLEAN,
  data_quality TEXT,
  user_tag TEXT                    -- from scrub (e.g., 'NTC', '720+_active_4+' etc.)
);

-- 2) Lender rules (BRE config)
CREATE TABLE IF NOT EXISTS lender_rules (
  lender_id TEXT PRIMARY KEY,
  lender_name TEXT NOT NULL,
  accepts_ntc BOOLEAN DEFAULT FALSE,
  min_score INTEGER,
  min_income NUMERIC,              -- monthly
  dpd_allowed_12m INTEGER,
  enquiries_3m_cap INTEGER,
  foir_cap NUMERIC,                -- 0.0–1.0
  amount_min NUMERIC,
  amount_max NUMERIC,
  tenure_min INTEGER,
  tenure_max INTEGER,
  roi_min NUMERIC,
  roi_max NUMERIC,
  priority INTEGER DEFAULT 100,    -- for tie-break/ranking
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3) Pre-approved offers table
CREATE TABLE IF NOT EXISTS preapproved_offers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telephone TEXT NOT NULL,
  lender_id TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  roi NUMERIC NOT NULL,
  processing_fee NUMERIC,
  tenure_months TEXT,              -- JSON array of available tenures
  approval_probability INTEGER,
  features TEXT,                   -- JSON array of features
  valid_until DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lender_id) REFERENCES lender_rules(lender_id),
  UNIQUE(telephone, lender_id)
);

-- 4) Cache of offer computations (optional)
CREATE TABLE IF NOT EXISTS prequal_offer_cache (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bk_user_id TEXT,
  telephone TEXT,
  lender_id TEXT,
  eligible BOOLEAN,
  preapproved BOOLEAN DEFAULT FALSE,
  reason_codes TEXT,               -- JSON array of reason codes
  offer_data TEXT,                 -- JSON object with offer details
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5) User scenarios for testing (optional)
CREATE TABLE IF NOT EXISTS user_scenarios (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  telephone TEXT NOT NULL,
  scenario_description TEXT,
  expected_outcome TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_scrub_telephone ON scrub_base(telephone);
CREATE INDEX IF NOT EXISTS idx_scrub_process_date ON scrub_base(process_date);
CREATE INDEX IF NOT EXISTS idx_pa_telephone ON preapproved_offers(telephone);
CREATE INDEX IF NOT EXISTS idx_pa_lender ON preapproved_offers(lender_id);
CREATE INDEX IF NOT EXISTS idx_cache_telephone ON prequal_offer_cache(telephone);
CREATE INDEX IF NOT EXISTS idx_cache_created ON prequal_offer_cache(created_at);
