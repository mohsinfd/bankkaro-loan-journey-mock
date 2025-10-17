import { NextRequest, NextResponse } from 'next/server';
import ServerlessDatabaseService from '@/lib/serverlessDatabase';

export async function POST(request: NextRequest) {
  let db: ServerlessDatabaseService | null = null;
  
  try {
    const body = await request.json();
    
    // Simulate scrub intake delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const phoneNumber = body.phone_number;
    
    // Initialize database connection
    db = new ServerlessDatabaseService();
    
    // Get latest scrub data from database
    const scrubData = db.getLatestScrubData(phoneNumber);
    
    // Scenario C: No scrub data found
    if (!scrubData) {
      return NextResponse.json({
        success: false,
        error: 'no_data',
        message: 'No credit bureau data found for this phone number'
      });
    }
    
    // Scenario D: Stale scrub data
    if (!scrubData.freshness_ok) {
      return NextResponse.json({
        success: false,
        error: 'stale_data',
        message: 'Credit bureau data is older than 90 days',
        days_old: scrubData.days_since_process,
        data: scrubData
      });
    }
    
    // Scenarios A, B, E, F: Fresh scrub data
    return NextResponse.json({
      success: true,
      data: scrubData,
      message: 'Bureau data retrieved successfully'
    });
    
  } catch (error) {
    console.error('Scrub intake error:', error);
    return NextResponse.json(
      { success: false, error: 'Scrub intake failed' },
      { status: 500 }
    );
  } finally {
    if (db) {
      db.close();
    }
  }
}