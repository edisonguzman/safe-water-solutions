import * as React from 'react';

interface EmailProps {
  firstName1: string;
  firstName2?: string;
  waterSource: string;
  testResults: any;
  savings: {
    monthly: number;
    yearly: number;
  };
}

export const WaterReportEmail = ({
  firstName1,
  firstName2,
  waterSource,
  testResults,
  savings
}: EmailProps) => (
  <div style={{ fontFamily: 'sans-serif', color: '#333', lineHeight: '1.5' }}>
    <h1 style={{ color: '#0052cc' }}>Your Safe Water Solutions Report</h1>
    <p>Hi {firstName1}{firstName2 ? ` & ${firstName2}` : ''},</p>
    <p>It was a pleasure meeting with you today. Based on our water analysis for your <strong>{waterSource}</strong>, here is a summary of your results:</p>
    
    <div style={{ background: '#f4f7f9', padding: '20px', borderRadius: '10px' }}>
      <h3>Water Analysis Snapshot</h3>
      <ul>
        <li><strong>Hardness:</strong> {testResults.hardness} GPG</li>
        <li><strong>TDS:</strong> {testResults.tds} PPM</li>
        {testResults.chlorine && <li><strong>Chlorine:</strong> {testResults.chlorine} PPM</li>}
        {testResults.iron && <li><strong>Iron:</strong> {testResults.iron} PPM</li>}
      </ul>
    </div>

    <h2 style={{ color: '#28a745' }}>Your Estimated Savings</h2>
    <p>By switching to a Safe Water system, your projected savings are:</p>
    <ul style={{ fontSize: '18px', fontWeight: 'bold' }}>
      <li>Monthly: ${savings.monthly.toFixed(2)}</li>
      <li>Yearly: ${savings.yearly.toFixed(2)}</li>
    </ul>

    <p>If you have any questions about these results or the next steps for your home installation, please don't hesitate to reach out.</p>
    <p>Best regards,<br/>The Safe Water Solutions Team</p>
  </div>
);