import { NextResponse } from 'next/server';
import { sql } from '@/app/lib/db';
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const body = await request.json();
    
    // CHANGE: Extract from body.state because that's what is being sent
    const { 
      waterSource, 
      prospectInfo, 
      waterTestResults, 
      financialInputs 
    } = body.state || body; // Fallback to body just in case

    // Check if prospectInfo exists to prevent the crash
    if (!prospectInfo) {
      console.error("Missing prospectInfo in request body");
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO prospects (
        sales_rep_id,
        first_name1, last_name1, first_name2, last_name2,
        address, city, state, zip, email, phone,
        water_source, 
        hardness, tds, ph, chlorine, iron, nitrates,
        weekly_grocery_bill, product_percentage,
        weekly_bottled_water_cost, monthly_filter_cost,
        household_size
      ) VALUES (
        ${userId},
        ${prospectInfo.firstName1 || ''}, ${prospectInfo.lastName1 || ''},
        ${prospectInfo.firstName2 || ''}, ${prospectInfo.lastName2 || ''},
        ${prospectInfo.address || ''}, ${prospectInfo.city || ''},
        ${prospectInfo.state || ''}, ${prospectInfo.zip || ''},
        ${prospectInfo.email || ''}, ${prospectInfo.phone || ''},
        ${waterSource || 'City Water'},
        ${waterTestResults?.hardness || 0}, ${waterTestResults?.tds || 0},
        ${waterTestResults?.ph || 7}, ${waterTestResults?.chlorine || 0},
        ${waterTestResults?.iron || 0}, ${waterTestResults?.nitrates || 0},
        ${financialInputs?.weeklyGroceryBill || 0}, 
        ${financialInputs?.productPercentage || 0.15},
        ${financialInputs?.weeklyBottledWaterCost || 0},
        ${financialInputs?.monthlyFilterCost || 0},
        ${prospectInfo.householdSize || 1}
      )
      RETURNING id;
    `;

    return NextResponse.json({ success: true, prospectId: result[0].id });
  } catch (error) {
    console.error("Database Save Error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}