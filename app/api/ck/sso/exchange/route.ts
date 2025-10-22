import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Simulate SSO token exchange
    if (body.ck_token) {
      // Mock successful SSO exchange
      const bkToken = `mock_bk_token_${Date.now()}`;
      const bkUserId = `BK${Math.floor(Math.random() * 1000000)}`;
      
      // Use the selected user from the request body if available
      const user = body.selectedUser || {
        ck_user_id: "CK123456",
        email: "user@cashkaro.com", 
        phone: "+919876543210",
        cohort: "Champion",
        name: "User",
        profile_complete: true,
        last_login: new Date().toISOString()
      };
      
      return NextResponse.json({
        success: true,
        bk_token: bkToken,
        bk_user_id: bkUserId,
        user: user,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid CK token' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'SSO exchange failed' },
      { status: 500 }
    );
  }
}
