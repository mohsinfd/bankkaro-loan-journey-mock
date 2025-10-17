# BankKaro Pre-Qualified Loan Journey - Interactive PRD Mock

A comprehensive, database-driven mock application that demonstrates the complete BankKaro Pre-Qualified and Pre-Approved loan journey with full transparency of backend logic, API calls, and data flow.

## 🎯 **Purpose**

This mock serves as an **interactive PRD demonstration tool** where stakeholders can:
- Select any user scenario from 6 predefined profiles
- See exact API calls and data flow in real-time
- Understand BRE logic with step-by-step gate evaluation
- Experience all system states defined in the PRD
- View reason codes and failure explanations
- See Pre-Approved vs Pre-Qualified differentiation
- Reference PRD sections directly from UI elements

## 🏗️ **Architecture**

### **Database-Driven Implementation**
- **SQLite Database** with realistic credit bureau data
- **Production-like architecture** with proper data persistence
- **Dynamic BRE evaluation** using real database queries
- **Scalable and maintainable** codebase

### **Key Components**
- **6 User Scenarios** covering all PRD use cases
- **4 Lender Configurations** with real BRE rules
- **Pre-Approved Offers** with PA/PQ differentiation
- **Comprehensive BRE Logic** with 8 evaluation gates
- **Real-time API Monitoring** and data flow visualization

## 📊 **User Scenarios**

| Scenario | User | Phone | Score | Income | Expected Outcome |
|----------|------|-------|-------|--------|------------------|
| **A** | Rohit Sharma | +919812345678 | 785 | ₹60k | 3+ eligible lenders (1 PA + 3 PQ) |
| **B** | Anita Desai | +919811234567 | 645 | ₹40k | 0 eligible lenders (multiple failures) |
| **C** | Mohammed Iqbal | +919876543210 | 720 | ₹25k | Limited eligible (high enquiries) |
| **D** | Leena Kapoor | +919812367890 | 710 | ₹48k | Greyed offers (stale data >90d) |
| **E** | Vikas Jain | +919876512345 | null | ₹30k | NTC-accepting lenders only |
| **F** | Sneha Patel | +919867890123 | 760 | ₹80k | 2 PA offers + PQ offers |

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn

### **Installation**
```bash
# Clone the repository
git clone <repository-url>
cd bankkaro-loan-journey-mock

# Install dependencies
npm install

# Initialize database with sample data
node database/init.js

# Start development server
npm run dev
```

### **Access the Application**
- **Local Development**: http://localhost:3000
- **Production**: [Vercel Deployment URL]

## 🎮 **How to Use**

### **1. Select User Scenario**
- Choose from dropdown on CashKaro entry page
- Each scenario represents a different PRD use case
- Preview shows key user attributes (score, income, etc.)

### **2. Experience the Journey**
- **CashKaro Entry** → **BankKaro Login** → **Scrub Loading** → **Offer Display**
- Watch real-time API calls in the floating tracker
- See data transformations at each step

### **3. Explore BRE Logic**
- Click **"BRE Debug Panel"** to see step-by-step evaluation
- View all 8 BRE gates with pass/fail status
- Understand reason codes for failures
- See Pre-Approved overrides in action

### **4. Analyze Results**
- **Pre-Approved Offers** (gold badges) shown first
- **Pre-Qualified Offers** (green badges) shown second
- **Ineligible Offers** with detailed failure reasons
- **Stale Data Warnings** for outdated bureau data

## 🔧 **Technical Details**

### **Database Schema**
```sql
-- Core tables
scrub_base          -- Credit bureau data
lender_rules        -- BRE configurations
preapproved_offers  -- PA offer data
user_scenarios      -- Test scenarios
prequal_offer_cache -- Performance cache
```

### **BRE Evaluation Gates**
1. **Freshness Check** (≤90 days)
2. **NTC Check** (lender accepts NTC)
3. **Score Check** (minimum threshold)
4. **DPD Check** (days past due)
5. **Enquiries Check** (3M cap)
6. **Income Check** (minimum income)
7. **FOIR Check** (obligation ratio)
8. **Range Check** (amount/tenure)

### **API Endpoints**
- `POST /api/bureau/scrub/intake` - Fetch bureau data
- `POST /api/offers/prequal` - BRE evaluation
- `POST /api/offers/fallback` - Basic info offers
- `POST /api/ck/sso/exchange` - SSO simulation

## 📈 **Features**

### **Transparency Features**
- ✅ **Real-time API Monitoring** - See all API calls with timing
- ✅ **BRE Debug Panel** - Step-by-step evaluation logic
- ✅ **Data Flow Visualizer** - Journey progress tracking
- ✅ **PRD References** - Hover tooltips with section references

### **User Experience**
- ✅ **Responsive Design** - Works on all devices
- ✅ **Loading States** - Realistic processing delays
- ✅ **Error Handling** - Graceful failure scenarios
- ✅ **Feedback Collection** - User input widgets

### **Business Logic**
- ✅ **Multi-Scenario Support** - All PRD use cases covered
- ✅ **Pre-Approved Integration** - PA/PQ differentiation
- ✅ **Stale Data Handling** - Real-world edge cases
- ✅ **Fallback Flows** - No data scenarios

## 🧪 **Testing**

### **Run Database Tests**
```bash
node scripts/test-database.js
```

### **Expected Test Results**
- ✅ 6 user scenarios loaded
- ✅ All scrub data accessible
- ✅ BRE evaluation working
- ✅ Pre-approved offers functional

### **Manual Testing Checklist**
- [ ] All 6 scenarios produce expected outcomes
- [ ] BRE Debug Panel shows correct gate evaluations
- [ ] API Call Tracker captures all requests
- [ ] Pre-Approved offers display with gold badges
- [ ] Stale data shows greyed offers with warnings
- [ ] No scrub data triggers fallback form

## 📋 **PRD Compliance**

This mock implements the complete **BankKaro Pre-Qualified & Pre-Approved Loan Journey PRD** including:

- ✅ **Section 3A**: Fresh Scrub → PQ Passed
- ✅ **Section 3B**: Fresh Scrub → PQ Failed  
- ✅ **Section 3C**: No Scrub Found
- ✅ **Section 3D**: Stale Scrub Data
- ✅ **Section 5.2**: BRE Evaluation Flow
- ✅ **Section 6.3**: Pre-Approved Flag Integration

## 🤝 **Contributing**

### **Adding New Scenarios**
1. Add user to `database/init.js` seed data
2. Update `ui/data/users_mock.json`
3. Test scenario with `scripts/test-database.js`

### **Modifying BRE Logic**
1. Update `lib/database.js` evaluation functions
2. Modify lender rules in database schema
3. Test with all scenarios

### **Enhancing UI**
1. Add components to `ui/components/`
2. Update pages in `ui/pages/`
3. Ensure responsive design

## 📞 **Support**

For questions or issues:
- Check the **BRE Debug Panel** for evaluation details
- Review **API Call Tracker** for request/response data
- Examine **Data Flow Visualizer** for journey progress
- Use **PRD Tooltips** for section references

## 📄 **License**

This project is for demonstration purposes as part of the BankKaro Pre-Qualified Loan Journey PRD.

---

**Built with Next.js 14, SQLite, and Tailwind CSS**