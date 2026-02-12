import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

interface RegisterData {
  email: string;
  password: string;
  userType: 'investor' | 'company' | 'seller';
  referenceId?: number;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  userId?: number;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const { email, password, userType, referenceId }: RegisterData = await request.json();

    // Validate input
    if (!email || !password || !userType) {
      return NextResponse.json(
        { success: false, error: 'Email, password, and user type are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (Array.isArray(existingUser) && existingUser.length > 0) {
      return NextResponse.json(
        { success: false, error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert user
    const sql = `
      INSERT INTO users (email, password_hash, user_type, reference_id, is_verified, is_active)
      VALUES (?, ?, ?, ?, FALSE, TRUE)
    `;

    const result = await query(sql, [email, passwordHash, userType, referenceId || null]);
    const userId = (result as any).insertId;

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      userId: userId
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to register user' },
      { status: 500 }
    );
  }
}