import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    
    // Get pending investors with their details
    const sql = `
      SELECT 
        i.id,
        i.full_name as name,
        i.email,
        i.phone,
        i.country as location,
        CASE 
          WHEN i.accreditation_status = 1 THEN 'Accredited Investor'
          ELSE 'Individual'
        END as investorType,
        i.annual_income as netWorth,
        i.investment_capacity as investmentRange,
        i.years_of_experience as experience,
        i.preferred_sectors as sectors,
        i.investment_stage as stages,
        i.created_at as submittedDate,
        i.status
      FROM investors i
      WHERE i.status = ?
      ORDER BY i.created_at DESC
    `;
    
    const investors = await query(sql, [status]);
    
    // Parse JSON fields and format data
    const formattedInvestors = investors.map((investor: any) => ({
      ...investor,
      sectors: investor.sectors ? JSON.parse(investor.sectors) : [],
      stages: investor.stages ? JSON.parse(investor.stages) : [],
      submittedDate: new Date(investor.submittedDate).toISOString().split('T')[0],
      netWorth: formatNetWorth(investor.netWorth),
      investmentRange: formatInvestmentRange(investor.investmentRange),
      experience: formatExperience(investor.experience)
    }));
    
    return NextResponse.json({ 
      success: true, 
      data: formattedInvestors 
    });
    
  } catch (error: any) {
    console.error('Fetch investors error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch investors' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const { id, status, adminNotes } = await request.json();
    
    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Investor ID and status are required' },
        { status: 400 }
      );
    }
    
    const sql = `
      UPDATE investors 
      SET status = ?, admin_notes = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    
    await query(sql, [status, adminNotes, id]);
    
    return NextResponse.json({
      success: true,
      message: 'Investor status updated successfully'
    });
    
  } catch (error: any) {
    console.error('Update investor error:', error);
     return NextResponse.json(
      {
        success: false,
        error: error?.message || error?.toString() || 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// Helper functions for formatting
function formatNetWorth(income: string): string {
  const mapping: { [key: string]: string } = {
    'below-10l': 'Below ₹10 Lakhs',
    '10l-25l': '₹10L - ₹25L',
    '25l-50l': '₹25L - ₹50L',
    '50l-1cr': '₹50L - ₹1 Crore',
    'above-1cr': 'Above ₹1 Crore'
  };
  return mapping[income] || income;
}

function formatInvestmentRange(capacity: string): string {
  const mapping: { [key: string]: string } = {
    'below-10l': 'Below ₹10 Lakhs',
    '10l-50l': '₹10L - ₹50L',
    '50l-1cr': '₹50L - ₹1 Crore',
    'above-1cr': 'Above ₹1 Crore'
  };
  return mapping[capacity] || capacity;
}

function formatExperience(experience: string): string {
  const mapping: { [key: string]: string } = {
    '0-2': '0-2 years',
    '3-5': '3-5 years',
    '6-10': '6-10 years',
    '10+': '10+ years'
  };
  return mapping[experience] || experience;
}