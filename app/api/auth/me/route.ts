import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface ApiResponse {
  success: boolean;
  user?: any;
  error?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const sessionToken = request.cookies.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    // Verify session
    const sessionSql = `
      SELECT us.*, u.*,
             i.full_name as investor_name, i.status as investor_status,
             cr.company_name, cr.status as company_status,
             ss.full_name as seller_name, ss.status as seller_status
      FROM user_sessions us
      JOIN users u ON us.user_id = u.id
      LEFT JOIN investors i ON u.user_type = 'investor' AND u.reference_id = i.id
      LEFT JOIN company_registrations cr ON u.user_type = 'company' AND u.reference_id = cr.id
      LEFT JOIN secondary_sellers ss ON u.user_type = 'seller' AND u.reference_id = ss.id
      WHERE us.session_token = ? AND us.expires_at > NOW() AND u.is_active = TRUE
    `;

    const sessions = await query(sessionSql, [sessionToken]);

    if (!Array.isArray(sessions) || sessions.length === 0) {
      const response = NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 });
      response.cookies.set('session_token', '', { expires: new Date(0) });
      return response;
    }

    const session = sessions[0];

    // Prepare user data
    const userData = {
      id: session.user_id,
      email: session.email,
      userType: session.user_type,
      referenceId: session.reference_id,
      name: session.investor_name || session.company_name || session.seller_name,
      isVerified: session.is_verified,
      status: session.investor_status || session.company_status || session.seller_status
    };

    return NextResponse.json({ success: true, user: userData });

  } catch (error: any) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication check failed' },
      { status: 500 }
    );
  }
}