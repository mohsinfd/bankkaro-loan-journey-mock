import { NextRequest, NextResponse } from 'next/server';
import DatabaseService from '@/lib/database';

export async function POST(request: NextRequest) {
  let db = null;
  
  try {
    const body = await request.json();
    
    // Simulate BRE evaluation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (body.scrub_data) {
      const scrubData = body.scrub_data;
      const phoneNumber = scrubData.telephone;
      
      // Initialize database connection
      db = new DatabaseService();
      
      // Get all lender rules and pre-approved offers
      const lenders = db.getAllLenderRules();
      const paOffers = db.getPreApprovedOffers(phoneNumber);
      
      // Evaluate each lender using BRE logic
      const evaluations = lenders.map(lender => {
        const paOffer = paOffers.find(pa => pa.lender_id === lender.lender_id);
        return db.evaluateLender(scrubData, lender, paOffer);
      });
      
      // Separate PA and PQ offers
      const paOffersResult = evaluations.filter(l => l.preapproved);
      const pqOffers = evaluations.filter(l => l.eligible && !l.preapproved);
      const ineligibleOffers = evaluations.filter(l => !l.eligible);
      
      // Sort offers: PA first (by ROI), then PQ (by ROI), then ineligible
      const sortedOffers = [
        ...paOffersResult.sort((a, b) => a.roi - b.roi),
        ...pqOffers.sort((a, b) => a.roi - b.roi),
        ...ineligibleOffers
      ];
      
      const evaluationResult = {
        scrub_reference: scrubData.memberreference,
        evaluation_date: new Date().toISOString(),
        phone_number: phoneNumber,
        offers: sortedOffers,
        lenders: evaluations,
        summary: {
          total_eligible: pqOffers.length,
          total_preapproved: paOffersResult.length,
          total_lenders: evaluations.length,
          best_offer: sortedOffers.length > 0 ? {
            lender: sortedOffers[0].lender_name,
            roi: sortedOffers[0].roi,
            amount: sortedOffers[0].max_amount,
            preapproved: sortedOffers[0].preapproved
          } : null,
          estimated_emi_50k_36m: 1700,
          validity_days: 90
        }
      };
      
      return NextResponse.json({
        success: true,
        data: evaluationResult,
        message: 'Offers generated based on credit bureau data and BRE evaluation'
      });
    }
    
    if (body.fallback_data) {
      // Handle fallback data (basic information without scrub)
      const fallbackData = body.fallback_data;
      
      // Initialize database connection
      db = new DatabaseService();
      
      // Get all lender rules
      const lenders = db.getAllLenderRules();
      
      // Filter lenders based on basic criteria
      const eligibleLenders = lenders.filter(lender =>
        fallbackData.income >= lender.min_income &&
        fallbackData.age >= 21 && // Basic age check
        fallbackData.age <= 65 &&
        lender.employment_types?.includes(fallbackData.employment_type)
      );
      
      const fallbackOffers = {
        scrub_reference: null,
        evaluation_date: new Date().toISOString(),
        offers: eligibleLenders.map(lender => ({
          lender_id: lender.lender_id,
          lender_name: lender.lender_name,
          eligible: true,
          preapproved: false,
          roi: lender.roi_min + Math.floor(Math.random() * (lender.roi_max - lender.roi_min)),
          max_amount: Math.min(lender.amount_max, fallbackData.income * 10),
          processing_fee: Math.round(lender.roi_min * fallbackData.income / 100),
          tenure_available: Array.from({length: (lender.tenure_max - lender.tenure_min) / 12 + 1}, (_, i) => lender.tenure_min + (i * 12)),
          approval_probability: 60 + Math.floor(Math.random() * 25),
          badge: "Pre-Qualified",
          reason: null,
          icon: lender.icon,
          color: lender.color,
          features: ["Based on basic information", "Subject to verification", "Quick approval"],
          gates: [],
          reason_codes: [],
          pa_override: false
        })),
        summary: {
          total_eligible: eligibleLenders.length,
          total_preapproved: 0,
          total_lenders: lenders.length,
          best_offer: eligibleLenders.length > 0 ? {
            lender: eligibleLenders[0].lender_name,
            roi: eligibleLenders[0].roi_min,
            amount: Math.min(eligibleLenders[0].amount_max, fallbackData.income * 10),
            preapproved: false
          } : null,
          estimated_emi_50k_36m: 1600,
          validity_days: 90
        }
      };
      
      return NextResponse.json({
        success: true,
        data: fallbackOffers,
        message: 'Offers generated based on basic information'
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'No valid data provided' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Offer generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Offer generation failed' },
      { status: 500 }
    );
  } finally {
    if (db) {
      db.close();
    }
  }
}