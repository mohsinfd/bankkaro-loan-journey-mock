const DatabaseService = require('../lib/database');

async function testDatabase() {
  console.log('🧪 Testing Database Functionality...\n');
  
  const db = new DatabaseService();
  
  try {
    // Test 1: Get user scenarios
    console.log('📋 User Scenarios:');
    const scenarios = db.getAllUserScenarios();
    scenarios.forEach(scenario => {
      console.log(`  ${scenario.id}: ${scenario.name} (${scenario.telephone})`);
    });
    console.log('');
    
    // Test 2: Get scrub data for each scenario
    console.log('🔍 Scrub Data Test:');
    scenarios.forEach(scenario => {
      const scrubData = db.getLatestScrubData(scenario.telephone);
      if (scrubData) {
        console.log(`  ${scenario.name}: Score ${scrubData.score}, Income ₹${scrubData.income}, Fresh: ${scrubData.freshness_ok}`);
      } else {
        console.log(`  ${scenario.name}: No scrub data found`);
      }
    });
    console.log('');
    
    // Test 3: Test BRE evaluation for Scenario A (Rohit Sharma)
    console.log('⚙️ BRE Evaluation Test (Scenario A - Rohit Sharma):');
    const rohitData = db.getLatestScrubData('+919812345678');
    const lenders = db.getAllLenderRules();
    const paOffers = db.getPreApprovedOffers('+919812345678');
    
    if (rohitData) {
      console.log(`  Profile: Score ${rohitData.score}, Income ₹${rohitData.income}, DPD ${rohitData.dpd_l12m}, Enquiries ${rohitData.total_enquiries_3m}`);
      console.log(`  Freshness: ${rohitData.freshness_ok ? 'Fresh' : 'Stale'} (${rohitData.days_since_process} days old)`);
      console.log(`  Risk Band: ${rohitData.risk_band}`);
      console.log(`  PA Offers: ${paOffers.length}`);
      console.log('');
      
      // Evaluate each lender
      lenders.forEach(lender => {
        const paOffer = paOffers.find(pa => pa.lender_id === lender.lender_id);
        const evaluation = db.evaluateLender(rohitData, lender, paOffer);
        console.log(`  ${lender.lender_name}: ${evaluation.eligible ? '✅ Eligible' : '❌ Not Eligible'} ${evaluation.preapproved ? '(PA)' : '(PQ)'}`);
        if (!evaluation.eligible && evaluation.reason_codes.length > 0) {
          console.log(`    Reason: ${evaluation.reason_codes.join(', ')}`);
        }
      });
    }
    console.log('');
    
    // Test 4: Test Scenario F (Sneha Patel) - PA offers
    console.log('⭐ Pre-Approved Offers Test (Scenario F - Sneha Patel):');
    const snehaData = db.getLatestScrubData('+919867890123');
    const snehaPaOffers = db.getPreApprovedOffers('+919867890123');
    
    if (snehaData) {
      console.log(`  Profile: Score ${snehaData.score}, Income ₹${snehaData.income}`);
      console.log(`  PA Offers: ${snehaPaOffers.length}`);
      snehaPaOffers.forEach(offer => {
        const lender = lenders.find(l => l.lender_id === offer.lender_id);
        console.log(`    ${lender?.lender_name}: ₹${offer.amount} @ ${offer.roi}% ROI`);
      });
    }
    console.log('');
    
    console.log('✅ Database tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    db.close();
  }
}

// Run tests
testDatabase();
