import { NextRequest, NextResponse } from 'next/server';
import userMock from '@/ui/data/user_mock.json';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Simulate SSO token exchange
    if (body.ck_token) {
      // Mock successful SSO exchange
      const bkToken = `mock_bk_token_${Date.now()}`;
      const bkUserId = `BK${Math.floor(Math.random() * 1000000)}`;
      
      return NextResponse.json({
        success: true,
        bk_token: bkToken,
        bk_user_id: bkUserId,
        user: userMock,
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
