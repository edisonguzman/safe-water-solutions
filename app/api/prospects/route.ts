import { NextResponse } from 'next/server';
import { sql } from '@/app/lib/db';

export async function POST(request: Request) {
  try {
    // 1. Parse the incoming JSON data from the frontend presentation
    const body = await request.json();
    
    // Destructure exactly how we set it up in the PresentationContext
    const { waterSource, prospectInfo, waterTestResults, financialInputs } = body;

    // TODO: Once Clerk auth is fully active, this will be the actual logged-in user's ID.
    // For testing right now, we will use a placeholder so the database accepts it.
    const salesRepId = 'test_rep_123'; 

    // 2. Insert the data into the Neon PostgreSQL database
    const result = await sql`
      INSERT INTO prospects (
        sales_rep_id,
        partner1_name, 
        partner2_name, 
        address, 
        email,
        household_size, 
        water_source,
        tds, 
        hardness, 
        ph, 
        chlorine, 
        weekly_bottled_water_cost, 
        monthly_filter_cost, 
        weekly_grocery_bill
      ) VALUES (
        ${salesRepId},
        ${prospectInfo.partner1Name || ''}, 
        ${prospectInfo.partner2Name || ''}, 
        ${prospectInfo.address || ''},
        ${prospectInfo.email || ''},
        ${prospectInfo.householdSize || 1}, 
        ${waterSource || null},
        ${waterTestResults.tds || ''}, 
        ${waterTestResults.hardness || ''}, 
        ${waterTestResults.ph || ''}, 
        ${waterTestResults.chlorine || ''}, 
        ${financialInputs.weeklyBottledWaterCost || 0}, 
        ${financialInputs.monthlyFilterCost || 0}, 
        ${financialInputs.weeklyGroceryBill || 0}
      )
      RETURNING id;
    `;

    // 3. Send a success response back to the frontend with the new Database ID
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