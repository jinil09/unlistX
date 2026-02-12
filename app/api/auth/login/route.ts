import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

interface LoginData {
  email: string;
  password: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  user?: any;
  sessionToken?: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const { email, password }: LoginData = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const userSql = `
      SELECT u.*, 
             i.full_name as investor_name,
             cr.company_name,
             ss.full_name as seller_name
      FROM users u
      LEFT JOIN investors i ON u.user_type = 'investor' AND u.reference_id = i.id
      LEFT JOIN company_registrations cr ON u.user_type = 'company' AND u.reference_id = cr.id
      LEFT JOIN secondary_sellers ss ON u.user_type = 'seller' AND u.reference_id = ss.id
      WHERE u.email = ? AND u.is_active = TRUE
    `;

    const users = await query(userSql, [email]);

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if account is approved based on user type
    if (user.user_type === 'investor') {
      const investor = await query('SELECT status FROM investors WHERE id = ?', [user.reference_id]);
      if (investor && investor[0] && investor[0].status !== 'approved') {
        return NextResponse.json(
          { success: false, error: 'Your investor account is pending approval' },
          { status: 403 }
        );
      }
    } else if (user.user_type === 'company') {
      const company = await query('SELECT status FROM company_registrations WHERE id = ?', [user.reference_id]);
      if (company && company[0] && company[0].status !== 'approved') {
        return NextResponse.json(
          { success: false, error: 'Your company account is pending approval' },
          { status: 403 }
        );
      }
    } else if (user.user_type === 'seller') {
      const seller = await query('SELECT status FROM secondary_sellers WHERE id = ?', [user.reference_id]);
      if (seller && seller[0] && seller[0].status !== 'approved') {
        return NextResponse.json(
          { success: false, error: 'Your seller account is pending approval' },
          { status: 403 }
        );
      }
    }

    // Generate session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    // Create session
    await query(
      'INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)',
      [user.id, sessionToken, expiresAt]
    );

    // Update last login
    await query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [user.id]
    );

    // Prepare user data for response (exclude sensitive info)
    const userData = {
      id: user.id,
      email: user.email,
      userType: user.user_type,
      referenceId: user.reference_id,
      name: user.investor_name || user.company_name || user.seller_name,
      isVerified: user.is_verified
    };

    // Set session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userData,
      sessionToken: sessionToken
    });

    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}