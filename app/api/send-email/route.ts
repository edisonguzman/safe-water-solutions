import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Destructure based on the state we send from the frontend
    const { state, savings } = body;
    const { prospectInfo, waterTestResults, waterSource } = state;

    const { data, error } = await resend.emails.send({
      from: 'Safe Water Solutions <onboarding@resend.dev>', // Update this to your domain later
      to: [prospectInfo.email],
      subject: `Water Test Results for ${prospectInfo.address}`,
      html: `
        <div style="font-family: sans-serif; color: #333; line-height: 1.6;">
          <h1 style="color: #0052cc;">Safe Water Solutions: Your Personalized Report</h1>
          <p>Hello ${prospectInfo.firstName1}${prospectInfo.firstName2 ? ` & ${prospectInfo.firstName2}` : ''},</p>
          <p>It was a pleasure meeting with you today. Here is a summary of the water analysis conducted at your home:</p>
          
          <div style="background: #f4f7f9; padding: 20px; border-radius: 10px; border: 1px solid #e1e8ed;">
            <h3 style="margin-top: 0;">Water Quality Analysis (${waterSource})</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Hardness:</strong> ${waterTestResults.hardness} GPG</li>
              <li><strong>TDS:</strong> ${waterTestResults.tds} PPM</li>
              <li><strong>pH Level:</strong> ${waterTestResults.ph}</li>
              ${waterTestResults.chlorine ? `<li><strong>Chlorine:</strong> ${waterTestResults.chlorine} PPM</li>` : ''}
              ${waterTestResults.iron ? `<li><strong>Iron:</strong> ${waterTestResults.iron} PPM</li>` : ''}
              ${waterTestResults.nitrates ? `<li><strong>Nitrates:</strong> ${waterTestResults.nitrates} mg/L</li>` : ''}
            </ul>
          </div>

          <h2 style="color: #28a745;">Financial Impact & Savings</h2>
          <p>Based on your household usage, switching to treated water offers a significant return on investment:</p>
          <div style="font-size: 18px; font-weight: bold; color: #28a745;">
            Estimated Monthly Savings: $${savings.monthly.toFixed(2)}<br/>
            Estimated Yearly Savings: $${savings.yearly.toFixed(2)}
          </div>

          <p style="margin-top: 30px;">We look forward to helping you improve your home's water quality and bring "Peace of Mind in Every Drop" to your family.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #777;">
            Safe Water Solutions Report | ${prospectInfo.address}, ${prospectInfo.city}, ${prospectInfo.state}
          </p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Email API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}