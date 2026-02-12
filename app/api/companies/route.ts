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
    const status = searchParams.get('status') || 'approved';
    
    // Get approved companies for showcase
    const sql = `
      SELECT 
        id,
        company_name,
        logo_filename,
        industry,
        registered_address,
        year_of_incorporation,
        website,
        about_company,
        previous_sales,
        future_projections,
        shares_offered,
        price_per_share,
        total_amount,
        purpose_of_fundraising,
        listing_type,
        status,
        contact_person,
        email,
        mobile,
        created_at
      FROM company_registrations 
      WHERE status = ?
      ORDER BY 
        listing_type DESC, -- Premium listings first
        created_at DESC
    `;
    
    const companies = await query(sql, [status]);
    
    return NextResponse.json({ 
      success: true, 
      data: companies 
    });
    
  } catch (error: any) {
    console.error('Fetch companies error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}