import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { prospect } = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'Safe Water Solutions <onboarding@resend.dev>', // Later, use your own domain
      to: [prospect.email],
      subject: `Water Test Results for ${prospect.address}`,
      html: `
        <h1>Safe Water Solutions: Test Results</h1>
        <p>Hello ${prospect.partner1_name},</p>
        <p>It was a pleasure meeting with you. Here is a summary of your water test results:</p>
        <ul>
          <li><strong>TDS:</strong> ${prospect.tds}</li>
          <li><strong>Hardness:</strong> ${prospect.hardness}</li>
          <li><strong>pH:</strong> ${prospect.ph}</li>
          <li><strong>Water Source:</strong> ${prospect.water_source}</li>
        </ul>
        <p>Based on our discussion, your estimated monthly savings with treated water is significant. We look forward to helping you improve your home's water quality.</p>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}