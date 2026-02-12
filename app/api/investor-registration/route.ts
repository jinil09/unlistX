import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

interface InvestorRegistrationData {
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  country: string;
  panId: string;
  password: string;
  
  // Professional Information
  occupation: string;
  organization: string;
  annualIncome: string;
  investmentCapacity: string;
  
  // Investment Experience
  yearsOfExperience: string;
  previousInvestments: string[];
  preferredSectors: string[];
  investmentStage: string[];
  
  // Compliance
  accreditationStatus: boolean;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  
  // Optional
  bio: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  investorId?: number;
  error?: string;
  details?: string;
}

interface Investor {
  id: number;
  full_name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  [key: string]: any;
}

interface GetResponse {
  success: boolean;
  data?: Investor[];
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const formData: InvestorRegistrationData = await request.json();

    // Validate required fields
    const requiredFields = [
      'fullName', 'email', 'phone', 'country', 'password',
      'annualIncome', 'investmentCapacity', 'yearsOfExperience',
      'termsAccepted', 'privacyAccepted'
    ];

    const missingFields = requiredFields.filter(field => !formData[field as keyof InvestorRegistrationData]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          details: `Required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Check if investor already exists
    const existingInvestor = await query(
      'SELECT id FROM investors WHERE email = ?',
      [formData.email]
    );

    if (Array.isArray(existingInvestor) && existingInvestor.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Investor already exists',
          details: 'An investor with this email already exists' 
        },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(formData.password, saltRounds);

    // Insert into database
    const sql = `
      INSERT INTO investors (
        full_name, email, phone, country, pan_id, occupation, organization,
        annual_income, investment_capacity, years_of_experience,
        previous_investments, preferred_sectors, investment_stage,
        password_hash, accreditation_status, terms_accepted, privacy_accepted, bio
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      formData.fullName,
      formData.email,
      formData.phone,
      formData.country,
      formData.panId || null,
      formData.occupation || null,
      formData.organization || null,
      formData.annualIncome,
      formData.investmentCapacity,
      formData.yearsOfExperience,
      JSON.stringify(formData.previousInvestments || []),
      JSON.stringify(formData.preferredSectors || []),
      JSON.stringify(formData.investmentStage || []),
      passwordHash,
      formData.accreditationStatus || false,
      formData.termsAccepted,
      formData.privacyAccepted,
      formData.bio || null
    ];

    const result = await query(sql, values);

    return NextResponse.json({
      success: true,
      message: 'Investor registration submitted successfully',
      investorId: (result as any).insertId
    });

  } catch (error: any) {
    console.error('Investor registration error:', error);
    
    // Handle duplicate email error
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Investor already exists',
          details: 'An investor with this email already exists' 
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit investor registration',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse<GetResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (email) {
      // Get investor by email (excluding password hash)
      const sql = `
        SELECT id, full_name, email, phone, country, pan_id, occupation, organization,
               annual_income, investment_capacity, years_of_experience,
               previous_investments, preferred_sectors, investment_stage,
               accreditation_status, status, created_at
        FROM investors 
        WHERE email = ? 
        ORDER BY created_at DESC
      `;
      const investors = await query(sql, [email]) as Investor[];
      return NextResponse.json({ success: true, data: investors });
    } else {
      // Get all investors (for admin - excluding sensitive data)
      const sql = `
        SELECT id, full_name, email, status, created_at 
        FROM investors 
        ORDER BY created_at DESC
      `;
      const investors = await query(sql) as Investor[];
      return NextResponse.json({ success: true, data: investors });
    }
  } catch (error: any) {
    console.error('Fetch investors error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch investors' },
      { status: 500 }
    );
  }
}