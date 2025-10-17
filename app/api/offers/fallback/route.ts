import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Simulate fallback offer generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const { income, employment_type, pincode, age } = body;
    
    // Basic validation
    if (!income || !employment_type || !pincode || !age) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Return fallback data for prequal endpoint
    return NextResponse.json({
      success: true,
      fallback_data: {
        income: parseInt(income),
        employment_type,
        pincode,
        age: parseInt(age)
      },
      message: 'Fallback data processed successfully'
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Fallback processing failed' },
      { status: 500 }
    );
  }
}
