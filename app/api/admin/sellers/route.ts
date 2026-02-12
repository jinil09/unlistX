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
    
    // Get pending secondary sellers with their holdings
    const sql = `
      SELECT 
        ss.id,
        ss.full_name as name,
        ss.email,
        ss.phone,
        ss.bank_name as bankName,
        ss.account_number as accountNumber,
        ss.reason_for_selling as reason,
        ss.urgency,
        ss.created_at as submittedDate,
        ss.status,
        (
          SELECT COUNT(*) 
          FROM seller_company_holdings sch 
          WHERE sch.seller_id = ss.id
        ) as totalHoldings,
        (
          SELECT SUM(sch.total_value)
          FROM seller_company_holdings sch 
          WHERE sch.seller_id = ss.id
        ) as totalValue
      FROM secondary_sellers ss
      WHERE ss.status = ?
      ORDER BY ss.created_at DESC
    `;
    
    const sellers = await query(sql, [status]);
    
    // Format the data
    const formattedSellers = sellers.map((seller: any) => ({
      ...seller,
      submittedDate: new Date(seller.submittedDate).toISOString().split('T')[0],
      totalValue: seller.totalValue ? `₹${(seller.totalValue / 10000000).toFixed(2)} Crores` : '₹0'
    }));
    
    return NextResponse.json({ 
      success: true, 
      data: formattedSellers 
    });
    
  } catch (error: any) {
    console.error('Fetch sellers error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sellers' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const { id, status, adminNotes } = await request.json();
    
    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Seller ID and status are required' },
        { status: 400 }
      );
    }
    
    const sql = `
      UPDATE secondary_sellers 
      SET status = ?, admin_notes = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    
    await query(sql, [status, adminNotes, id]);
    
    return NextResponse.json({
      success: true,
      message: 'Seller status updated successfully'
    });
    
  } catch (error: any) {
    console.error('Update seller error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update seller status' },
      { status: 500 }
    );
  }
}