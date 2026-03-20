import { NextResponse } from 'next/server';
import { sql } from '@/app/lib/db';
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    // 1. Parse the incoming JSON data
    const body = await request.json();
    const { waterSource, prospectInfo, waterTestResults, financialInputs } = body;

    // Use the actual logged-in rep's ID
    const salesRepId = userId || 'unauthenticated_rep'; 

    // 2. Insert data into Neon using your existing sql template style
    // We are updating the column names to match the new Slide 1 and Water Test Slide
    const result = await sql`
      INSERT INTO prospects (
        sales_rep_id,
        title1, first_name1, last_name1,
        title2, first_name2, last_name2,
        address, city, state, zip, phone, email,
        household_size, water_source,
        tds, hardness, ph, chlorine, iron, nitrates,
        weekly_grocery_bill, product_percentage
      ) VALUES (
        ${salesRepId},
        ${prospectInfo.title1 || ''}, 
        ${prospectInfo.firstName1 || ''}, 
        ${prospectInfo.lastName1 || ''},
        ${prospectInfo.title2 || ''}, 
        ${prospectInfo.firstName2 || ''}, 
        ${prospectInfo.lastName2 || ''},
        ${prospectInfo.address || ''},
        ${prospectInfo.city || ''},
        ${prospectInfo.state || ''},
        ${prospectInfo.zip || ''},
        ${prospectInfo.phone || ''},
        ${prospectInfo.email || ''},
        ${prospectInfo.householdSize || 1}, 
        ${waterSource || null},
        ${waterTestResults.tds || ''}, 
        ${waterTestResults.hardness || ''}, 
        ${waterTestResults.ph || ''}, 
        ${waterTestResults.chlorine || ''},
        ${waterTestResults.iron || ''},
        ${waterTestResults.nitrates || ''},
        ${financialInputs.weeklyGroceryBill || 0},
        ${financialInputs.productPercentage || 0.15}
      )
      RETURNING id;
    `;

    // 3. Send a success response
    return NextResponse.json({ 
      success: true, 
      message: "Prospect successfully saved to Custom CRM",
      prospectId: result[0].id 
    }, { status: 200 });

  } catch (error) {
    console.error('Failed to save prospect:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to save prospect to CRM' 
    }, { status: 500 });
  }
}