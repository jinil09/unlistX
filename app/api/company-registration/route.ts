import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

// Define TypeScript interfaces
interface CompanyRegistrationData {
  // Company Information
  companyName: string;
  yearOfIncorporation: string;
  registeredAddress: string;
  website: string;
  industry: string;
  aboutCompany: string;
  
  // Business Performance
  previousSales: string;
  previousTurnovers: string;
  keyClients: string;
  purchaseOrders: string;
  futureProjections: string;
  
  // Fundraising Details
  sharesOffered: string;
  pricePerShare: string;
  totalAmount: string;
  purposeOfFundraising: string;
  listingType: 'normal' | 'premium';
  
  // Shareholding & Compliance
  shareholdingPattern: string;
  directorsPromoters: string;
  legalCompliance: string;
  
  // Contact Information
  contactPerson: string;
  email: string;
  mobile: string;
  declaration: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  registrationId?: number;
  documents?: {
    logo?: string;
    financials?: string;
    businessPlan?: string;
    valuationReport?: string;
    purchaseOrdersDocs?: string;
  };
  error?: string;
  details?: string;
}

interface Registration {
  id: number;
  company_name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  [key: string]: any;
}

interface GetResponse {
  success: boolean;
  data?: Registration[];
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const formData = await request.formData();
    
    // Extract form data with proper typing
    const registrationData: Partial<CompanyRegistrationData> = {
      // Company Information
      companyName: formData.get('companyName') as string,
      yearOfIncorporation: formData.get('yearOfIncorporation') as string,
      registeredAddress: formData.get('registeredAddress') as string,
      website: formData.get('website') as string,
      industry: formData.get('industry') as string,
      aboutCompany: formData.get('aboutCompany') as string,
      
      // Business Performance
      previousSales: formData.get('previousSales') as string,
      previousTurnovers: formData.get('previousTurnovers') as string,
      keyClients: formData.get('keyClients') as string,
      purchaseOrders: formData.get('purchaseOrders') as string,
      futureProjections: formData.get('futureProjections') as string,
      
      // Fundraising Details
      sharesOffered: formData.get('sharesOffered') as string,
      pricePerShare: formData.get('pricePerShare') as string,
      totalAmount: formData.get('totalAmount') as string,
      purposeOfFundraising: formData.get('purposeOfFundraising') as string,
      listingType: formData.get('listingType') as 'normal' | 'premium',
      
      // Shareholding & Compliance
      shareholdingPattern: formData.get('shareholdingPattern') as string,
      directorsPromoters: formData.get('directorsPromoters') as string,
      legalCompliance: formData.get('legalCompliance') as string,
      
      // Contact Information
      contactPerson: formData.get('contactPerson') as string,
      email: formData.get('email') as string,
      mobile: formData.get('mobile') as string,
      declaration: formData.get('declaration') as string,
    };

    // Validate required fields
    const requiredFields = [
      'companyName', 'yearOfIncorporation', 'registeredAddress', 
      'industry', 'aboutCompany', 'contactPerson', 'email', 'mobile'
    ];

    const missingFields = requiredFields.filter(field => !registrationData[field as keyof CompanyRegistrationData]);

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

    // Handle file uploads
    const logoFile = formData.get('logo') as File | null;
    let logoFilename: string | undefined = undefined;

    if (logoFile && logoFile.size > 0) {
      const bytes = await logoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create unique filename
      const timestamp = Date.now();
      const originalName = logoFile.name;
      const extension = path.extname(originalName);
      logoFilename = `logo_${timestamp}${extension}`;
      
      // Save file to public/uploads directory
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      const filePath = path.join(uploadDir, logoFilename);
      
      await writeFile(filePath, buffer);
    }

    // Handle other document uploads
    const documentFiles: Record<string, string> = {};
    const documentFields = ['financials', 'businessPlan', 'valuationReport', 'purchaseOrdersDocs'];
    
    for (const field of documentFields) {
      const file = formData.get(field) as File | null;
      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const timestamp = Date.now();
        const originalName = file.name;
        const extension = path.extname(originalName);
        const filename = `${field}_${timestamp}${extension}`;
        
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'documents');
        const filePath = path.join(uploadDir, filename);
        
        await writeFile(filePath, buffer);
        documentFiles[field] = filename;
      }
    }

    // Insert into database
    const sql = `
      INSERT INTO company_registrations (
        company_name, logo_filename, year_of_incorporation, registered_address, 
        website, industry, about_company, previous_sales, previous_turnovers,
        key_clients, purchase_orders, future_projections, shares_offered,
        price_per_share, total_amount, purpose_of_fundraising, listing_type,
        shareholding_pattern, directors_promoters, legal_compliance,
        contact_person, email, mobile, declaration
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      registrationData.companyName,
      logoFilename || null,
      registrationData.yearOfIncorporation,
      registrationData.registeredAddress,
      registrationData.website,
      registrationData.industry,
      registrationData.aboutCompany,
      registrationData.previousSales,
      registrationData.previousTurnovers,
      registrationData.keyClients,
      registrationData.purchaseOrders,
      registrationData.futureProjections,
      registrationData.sharesOffered,
      registrationData.pricePerShare,
      registrationData.totalAmount,
      registrationData.purposeOfFundraising,
      registrationData.listingType,
      registrationData.shareholdingPattern,
      registrationData.directorsPromoters,
      registrationData.legalCompliance === 'true',
      registrationData.contactPerson,
      registrationData.email,
      registrationData.mobile,
      registrationData.declaration === 'true'
    ];

    const result = await query(sql, values);

    return NextResponse.json({
      success: true,
      message: 'Company registration submitted successfully',
      registrationId: (result as any).insertId,
      documents: {
        ...(logoFilename && { logo: logoFilename }),
        ...documentFiles
      }
    });

  } catch (error: any) {
    console.error('Registration submission error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit registration',
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
      // Get registration by email
      const sql = 'SELECT * FROM company_registrations WHERE email = ? ORDER BY created_at DESC';
      const registrations = await query(sql, [email]) as Registration[];
      return NextResponse.json({ success: true, data: registrations });
    } else {
      // Get all registrations (for admin)
      const sql = 'SELECT id, company_name, email, status, created_at FROM company_registrations ORDER BY created_at DESC';
      const registrations = await query(sql) as Registration[];
      return NextResponse.json({ success: true, data: registrations });
    }
  } catch (error: any) {
    console.error('Fetch registrations error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}