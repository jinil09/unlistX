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
    
    // Get pending company registrations with their details
    const sql = `
      SELECT 
        cr.id,
        cr.company_name as companyName,
        cr.email,
        cr.mobile as phone,
        cr.registered_address as location,
        cr.industry,
        cr.year_of_incorporation as yearIncorporated,
        cr.website,
        cr.previous_sales as lastYearSales,
        cr.future_projections as currentYearProjection,
        cr.shares_offered as sharesOffered,
        cr.price_per_share as pricePerShare,
        cr.total_amount as totalAmount,
        cr.purpose_of_fundraising as purpose,
        cr.listing_type as listingType,
        FALSE as feeWaived, -- Default value, can be updated
        cr.created_at as submittedDate,
        cr.status
      FROM company_registrations cr
      WHERE cr.status = ?
      ORDER BY cr.created_at DESC
    `;
    
    const companies = await query(sql, [status]);
    
    // Format the data
    const formattedCompanies = companies.map((company: any) => ({
      ...company,
      submittedDate: new Date(company.submittedDate).toISOString().split('T')[0],
      listingType: company.listingType || 'normal'
    }));
    
    return NextResponse.json({ 
      success: true, 
      data: formattedCompanies 
    });
    
  } catch (error: any) {
    console.error('Fetch companies error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const { id, status, listingType, feeWaived, adminNotes } = await request.json();
    
    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Company ID and status are required' },
        { status: 400 }
      );
    }
    
    const sql = `
        UPDATE company_registrations 
        SET status = ?, listing_type = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
    `;

    await query(sql, [status, listingType, id]);

    
    return NextResponse.json({
      success: true,
      message: 'Company status updated successfully'
    });
    
  } catch (error: any) {
    console.error('Update company error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}