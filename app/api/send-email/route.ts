import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { sql } from "@/app/lib/db";
import { calculateMonthlySavings } from "@/app/lib/formulas";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { state, prospectId } = body;

    let firstName1 = "";
    let firstName2 = "";
    let email = "";
    let address = "";
    let waterSource = "City Water";
    let hardness = 0, tds = 0, ph = 7.0, chlorine = 0;
    
    // Financial variables for the formula
    let weeklyGrocery = 0;
    let productPct = 0.15;
    let weeklyBottled = 0;
    let monthlyFilter = 0;
    let householdSize = 1;

    // 1. TRY DATABASE FIRST (New Ledger Data)
    const idToUse = prospectId || state?.prospectInfo?.id;
    
    if (idToUse) {
      const prospectResult = await sql.query(`SELECT * FROM prospects WHERE id = $1`, [idToUse]);
      const p = prospectResult[0];
      
      if (p) {
        firstName1 = p.first_name1;
        firstName2 = p.first_name2;
        email = p.email;
        address = p.address;
        waterSource = p.water_source;
        hardness = p.hardness;
        tds = p.tds;
        ph = p.ph;
        chlorine = p.chlorine;
        // Map database fields to formula variables
        weeklyGrocery = Number(p.weekly_grocery_bill) || 0;
        productPct = Number(p.product_percentage) || 0.15;
        weeklyBottled = Number(p.weekly_bottled_water_cost) || 0;
        monthlyFilter = Number(p.monthly_filter_cost) || 0;
        householdSize = Number(p.household_size) || 1;
      }
    }

    // 2. FALLBACK TO FRONTEND DATA (If DB lookup failed or ID was missing)
    if (!email && state?.prospectInfo) {
      firstName1 = state.prospectInfo.firstName1;
      firstName2 = state.prospectInfo.firstName2;
      email = state.prospectInfo.email;
      address = state.prospectInfo.address;
      waterSource = state.waterSource || "City Water";
      hardness = state.waterTestResults?.hardness || 0;
      tds = state.waterTestResults?.tds || 0;
      ph = state.waterTestResults?.ph || 7.0;
      chlorine = state.waterTestResults?.chlorine || 0;
      // Map state fields to formula variables
      weeklyGrocery = Number(state.financialInputs?.weeklyGroceryBill) || 0;
      productPct = Number(state.financialInputs?.productPercentage) || 0.15;
      weeklyBottled = Number(state.financialInputs?.weeklyBottledWaterCost) || 0;
      monthlyFilter = Number(state.financialInputs?.monthlyFilterCost) || 0;
      householdSize = Number(state.prospectInfo?.householdSize) || 1;
    }

    if (!email) {
      return NextResponse.json({ error: "No recipient email found" }, { status: 400 });
    }

    // 3. RUN CENTRALIZED CALCULATION (The "Sweet Smith" Fix)
    // We create a mock state object to pass into our shared formula
    const mockState = {
      financialInputs: {
        weeklyGroceryBill: weeklyGrocery,
        productPercentage: productPct,
        weeklyBottledWaterCost: weeklyBottled,
        monthlyFilterCost: monthlyFilter,
      },
      prospectInfo: {
        householdSize: householdSize,
      }
    };

    const savingsData = calculateMonthlySavings(mockState);
    const finalMonthly = savingsData.total;
    const finalYearly = finalMonthly * 12;

    const { data, error } = await resend.emails.send({
      from: 'Safe Water Solutions <info@safewatercms.com>', 
      to: [email],
      subject: `Water Test Results for ${address || 'Your Home'}`,
      html: `
        <div style="font-family: sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto;">
          <h1 style="color: #0052cc; border-bottom: 2px solid #0052cc; padding-bottom: 10px;">Safe Water Solutions Report</h1>
          <p>Hello ${firstName1 || 'Valued Customer'}${firstName2 ? ` & ${firstName2}` : ''},</p>
          <p>It was a pleasure meeting with you today. Here is the official summary of the water analysis conducted at your home:</p>
          
          <div style="background: #f4f7f9; padding: 20px; border-radius: 10px; border: 1px solid #e1e8ed; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #0052cc;">Water Quality Analysis (${waterSource})</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Hardness:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${hardness} GPG</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>TDS:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${tds} PPM</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>pH Level:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${ph}</td>
              </tr>
              ${chlorine ? `
              <tr>
                <td style="padding: 8px 0;"><strong>Chlorine:</strong></td>
                <td style="padding: 8px 0; text-align: right;">${chlorine} PPM</td>
              </tr>` : ''}
            </table>
          </div>

          <h2 style="color: #28a745;">Financial Impact & Savings</h2>
          <div style="background: #e9f7ef; padding: 20px; border-radius: 10px; border: 1px solid #d4edda; color: #155724;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
               <tr>
                <td style="padding: 4px 0;">Cleaning Products:</td>
                <td style="padding: 4px 0; text-align: right;">$${savingsData.soap.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0;">Bottled Water/Filters:</td>
                <td style="padding: 4px 0; text-align: right;">$${savingsData.water.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; border-bottom: 1px solid #c3e6cb; padding-bottom: 10px;">Household Water:</td>
                <td style="padding: 4px 0; text-align: right; border-bottom: 1px solid #c3e6cb; padding-bottom: 10px;">$${savingsData.householdWater.toFixed(2)}</td>
              </tr>
            </table>
            <div style="font-size: 20px; font-weight: bold; margin-top: 10px;">
              Total Monthly Savings: $${finalMonthly.toFixed(2)}<br/>
              Estimated Yearly Savings: $${finalYearly.toFixed(2)}
            </div>
          </div>
        </div>
      `,
    });

    if (error) return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}