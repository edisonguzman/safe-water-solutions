import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { state, savings } = body;

    // Safety check: ensure the nested objects exist
    const prospectInfo = state?.prospectInfo || {};
    const waterTestResults = state?.waterTestResults || {};
    const waterSource = state?.waterSource || "City Water";

    if (!prospectInfo.email) {
      return NextResponse.json({ error: "Missing recipient email" }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'info@safewatercms.com', 
      to: [prospectInfo.email],
      subject: `Water Test Results for ${prospectInfo.address || 'Your Home'}`,
      html: `
        <div style="font-family: sans-serif; color: #333; line-height: 1.6;">
          <h1 style="color: #0052cc;">Safe Water Solutions: Your Personalized Report</h1>
          <p>Hello ${prospectInfo.firstName1 || 'Valued Customer'}${prospectInfo.firstName2 ? ` & ${prospectInfo.firstName2}` : ''},</p>
          <p>It was a pleasure meeting with you today. Here is a summary of the water analysis conducted at your home:</p>
          
          <div style="background: #f4f7f9; padding: 20px; border-radius: 10px; border: 1px solid #e1e8ed;">
            <h3 style="margin-top: 0;">Water Quality Analysis (${waterSource})</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Hardness:</strong> ${waterTestResults.hardness || 0} GPG</li>
              <li><strong>TDS:</strong> ${waterTestResults.tds || 0} PPM</li>
              <li><strong>pH Level:</strong> ${waterTestResults.ph || 7.0}</li>
            </ul>
          </div>

          <h2 style="color: #28a745;">Financial Impact & Savings</h2>
          <div style="font-size: 18px; font-weight: bold; color: #28a745;">
            Estimated Monthly Savings: $${(savings?.monthly || 0).toFixed(2)}<br/>
            Estimated Yearly Savings: $${(savings?.yearly || 0).toFixed(2)}
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}