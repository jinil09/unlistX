import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import getPool from '@/lib/db';

interface CompanyHolding {
  id: string;
  companyName: string;
  shareQuantity: string;
  certificateNumber: string;
  acquisitionDate: string;
  acquisitionPrice: string;
  expectedPrice: string;
  proofDocument: File | null;
}

interface SecondarySellerRegistrationData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  panNumber: string;
  aadharNumber: string;
  companyHoldings: CompanyHolding[];
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  reasonForSelling: string;
  urgency: string;
  additionalNotes: string;
  agreeToTerms: boolean;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  sellerId?: number;
  error?: string;
  details?: string;
}

// Function to ensure directory exists
async function ensureDirectoryExists(dirPath: string) {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const registrationData: Partial<SecondarySellerRegistrationData> = {
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      password: formData.get('password') as string,
      panNumber: formData.get('panNumber') as string,
      aadharNumber: formData.get('aadharNumber') as string,
      bankName: formData.get('bankName') as string,
      accountNumber: formData.get('accountNumber') as string,
      ifscCode: formData.get('ifscCode') as string,
      accountHolderName: formData.get('accountHolderName') as string,
      reasonForSelling: formData.get('reasonForSelling') as string,
      urgency: formData.get('urgency') as string,
      additionalNotes: formData.get('additionalNotes') as string,
      agreeToTerms: formData.get('agreeToTerms') === 'true',
    };

    // Validate required fields
    const requiredFields = [
      'fullName', 'email', 'phone', 'password', 'panNumber', 'aadharNumber',
      'bankName', 'accountNumber', 'ifscCode', 'accountHolderName',
      'reasonForSelling', 'urgency', 'agreeToTerms'
    ];

    const missingFields = requiredFields.filter(field => !registrationData[field as keyof SecondarySellerRegistrationData]);

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

    // Check if seller already exists
    const existingSeller = await query(
      'SELECT id FROM secondary_sellers WHERE email = ?',
      [registrationData.email]
    );

    if (Array.isArray(existingSeller) && existingSeller.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Seller already exists',
          details: 'A seller with this email already exists' 
        },
        { status: 409 }
      );
    }

    // Ensure upload directories exist
    const documentsDir = path.join(process.cwd(), 'public', 'uploads', 'documents');
    const companyProofsDir = path.join(process.cwd(), 'public', 'uploads', 'company-proofs');
    
    await ensureDirectoryExists(documentsDir);
    await ensureDirectoryExists(companyProofsDir);

    // Handle file uploads
    const panCardFile = formData.get('panCard') as File | null;
    const aadharCardFile = formData.get('aadharCard') as File | null;
    
    let panCardFilename: string | null = null;
    let aadharCardFilename: string | null = null;

    // Upload PAN Card
    if (panCardFile && panCardFile.size > 0) {
      try {
        const bytes = await panCardFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const timestamp = Date.now();
        const originalName = panCardFile.name;
        const extension = path.extname(originalName);
        panCardFilename = `pan_${timestamp}${extension}`;
        
        const filePath = path.join(documentsDir, panCardFilename);
        await writeFile(filePath, buffer);
        console.log(`PAN card saved: ${filePath}`);
      } catch (fileError) {
        console.error('Error saving PAN card:', fileError);
        return NextResponse.json(
          { 
            success: false, 
            error: 'Failed to upload PAN card',
            details: 'Please try uploading the file again' 
          },
          { status: 500 }
        );
      }
    }

    // Upload Aadhar Card
    if (aadharCardFile && aadharCardFile.size > 0) {
      try {
        const bytes = await aadharCardFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const timestamp = Date.now();
        const originalName = aadharCardFile.name;
        const extension = path.extname(originalName);
        aadharCardFilename = `aadhar_${timestamp}${extension}`;
        
        const filePath = path.join(documentsDir, aadharCardFilename);
        await writeFile(filePath, buffer);
        console.log(`Aadhar card saved: ${filePath}`);
      } catch (fileError) {
        console.error('Error saving Aadhar card:', fileError);
        return NextResponse.json(
          { 
            success: false, 
            error: 'Failed to upload Aadhar card',
            details: 'Please try uploading the file again' 
          },
          { status: 500 }
        );
      }
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(registrationData.password!, saltRounds);

    // Get a connection from the pool for transaction
    // const pool = await import('@/lib/db').then(module => module.default());
    // const connection = await pool.getConnection();
    const pool = getPool(); // returns the persistent global pool
    const connection = await pool.getConnection(); // safe to use

    try {
      // Start transaction
      await connection.beginTransaction();

      // Insert into secondary_sellers table
      const sellerSql = `
        INSERT INTO secondary_sellers (
          full_name, email, phone, password_hash, pan_number, aadhar_number,
          bank_name, account_number, ifsc_code, account_holder_name,
          reason_for_selling, urgency, additional_notes,
          pan_card_filename, aadhar_card_filename, agree_to_terms
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const sellerValues = [
        registrationData.fullName,
        registrationData.email,
        registrationData.phone,
        passwordHash,
        registrationData.panNumber,
        registrationData.aadharNumber,
        registrationData.bankName,
        registrationData.accountNumber,
        registrationData.ifscCode,
        registrationData.accountHolderName,
        registrationData.reasonForSelling,
        registrationData.urgency,
        registrationData.additionalNotes || null,
        panCardFilename,
        aadharCardFilename,
        registrationData.agreeToTerms
      ];

      const [sellerResult] = await connection.execute(sellerSql, sellerValues);
      const sellerId = (sellerResult as any).insertId;

      // Process company holdings
      const companyHoldings: CompanyHolding[] = [];
      let index = 0;
      
      // Extract company holdings from form data
      while (true) {
        const companyName = formData.get(`companyHoldings[${index}][companyName]`) as string;
        if (!companyName) break;

        const holding: CompanyHolding = {
          id: formData.get(`companyHoldings[${index}][id]`) as string,
          companyName,
          shareQuantity: formData.get(`companyHoldings[${index}][shareQuantity]`) as string,
          certificateNumber: formData.get(`companyHoldings[${index}][certificateNumber]`) as string,
          acquisitionDate: formData.get(`companyHoldings[${index}][acquisitionDate]`) as string,
          acquisitionPrice: formData.get(`companyHoldings[${index}][acquisitionPrice]`) as string,
          expectedPrice: formData.get(`companyHoldings[${index}][expectedPrice]`) as string,
          proofDocument: formData.get(`companyHoldings[${index}][proofDocument]`) as File,
        };

        companyHoldings.push(holding);
        index++;
      }

      // Insert company holdings
      for (const holding of companyHoldings) {
        let proofDocumentFilename: string | null = null;

        // Upload proof document
        if (holding.proofDocument && holding.proofDocument.size > 0) {
          try {
            const bytes = await holding.proofDocument.arrayBuffer();
            const buffer = Buffer.from(bytes);
            
            const timestamp = Date.now();
            const originalName = holding.proofDocument.name;
            const extension = path.extname(originalName);
            proofDocumentFilename = `proof_${sellerId}_${timestamp}${extension}`;
            
            const filePath = path.join(companyProofsDir, proofDocumentFilename);
            await writeFile(filePath, buffer);
            console.log(`Proof document saved: ${filePath}`);
          } catch (fileError) {
            console.error('Error saving proof document:', fileError);
            // Continue without the file
            proofDocumentFilename = null;
          }
        }

        const holdingSql = `
          INSERT INTO seller_company_holdings (
            seller_id, company_name, share_quantity, certificate_number,
            acquisition_date, acquisition_price, expected_price, proof_document_filename
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const holdingValues = [
          sellerId,
          holding.companyName,
          parseInt(holding.shareQuantity) || 0,
          holding.certificateNumber,
          holding.acquisitionDate,
          parseFloat(holding.acquisitionPrice) || 0,
          parseFloat(holding.expectedPrice) || 0,
          proofDocumentFilename
        ];

        await connection.execute(holdingSql, holdingValues);
      }

      // Commit transaction
      await connection.commit();

      return NextResponse.json({
        success: true,
        message: 'Secondary seller registration submitted successfully',
        sellerId: sellerId
      });

    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    } finally {
      // Always release connection back to pool
      connection.release();
    }

  } catch (error: any) {
    console.error('Secondary seller registration error:', error);
    
    // Handle duplicate email error
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Seller already exists',
          details: 'A seller with this email already exists' 
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit seller registration',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// GET method (simplified without transactions)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (email) {
      // Get seller by email with their holdings
      const sellerSql = `
        SELECT id, full_name, email, phone, pan_number, aadhar_number,
               bank_name, account_number, ifsc_code, account_holder_name,
               reason_for_selling, urgency, additional_notes, status, created_at
        FROM secondary_sellers 
        WHERE email = ?
      `;
      
      const sellers = await query(sellerSql, [email]);
      
      if (Array.isArray(sellers) && sellers.length > 0) {
        const seller = sellers[0];
        
        // Get company holdings
        const holdingsSql = `
          SELECT id, company_name, share_quantity, certificate_number,
                 acquisition_date, acquisition_price, expected_price,
                 total_value, potential_return, status
          FROM seller_company_holdings 
          WHERE seller_id = ?
          ORDER BY created_at DESC
        `;
        
        const holdings = await query(holdingsSql, [seller.id]);
        
        return NextResponse.json({ 
          success: true, 
          data: { ...seller, holdings } 
        });
      }
      
      return NextResponse.json({ success: true, data: null });
      
    } else {
      // Get all sellers (for admin)
      const sql = `
        SELECT id, full_name, email, status, created_at 
        FROM secondary_sellers 
        ORDER BY created_at DESC
      `;
      const sellers = await query(sql);
      return NextResponse.json({ success: true, data: sellers });
    }
  } catch (error: any) {
    console.error('Fetch sellers error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sellers' },
      { status: 500 }
    );
  }
}