import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { sql } from "@/app/lib/db";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Support BOTH the old way (state) and the new way (prospectId)
    // Also extracting monthly/yearly directly in case they are sent at top level
    const { state, savings, prospectId, monthly, yearly } = body;

    let firstName1 = "";
    let firstName2 = "";
    let email = "";
    let address = "";
    let waterSource = "City Water";
    let hardness = 0, tds = 0, ph = 7.0;

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
    }

    if (!email) {
      return NextResponse.json({ error: "No recipient email found" }, { status: 400 });
    }

    // --- MATCHING THE WORKING WEBSITE FIELDS ---
    // This pulls the exact values that your Summary Page is already displaying correctly
    const finalMonthly = Number(state?.financialInputs?.monthlySavings) || 
                         Number(savings?.monthly) || 
                         Number(state?.savings?.monthly) || 0;
                         
    const finalYearly = Number(state?.financialInputs?.yearlySavings) || 
                        Number(savings?.yearly) || 
                        Number(state?.savings?.yearly) || 
                        (finalMonthly * 12);

    const { data, error } = await resend.emails.send({
      from: 'info@safewatercms.com', 
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
                <td style="padding: 8px 0;"><strong>pH Level:</strong></td>
                <td style="padding: 8px 0; text-align: right;">${ph}</td>
              </tr>
            </table>
          </div>

          <h2 style="color: #28a745;">Financial Impact & Savings</h2>
          <div style="background: #e9f7ef; padding: 20px; border-radius: 10px; border: 1px solid #d4edda; color: #155724;">
            <div style="font-size: 18px; font-weight: bold;">
              Estimated Monthly Savings: $${finalMonthly.toFixed(2)}<br/>
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