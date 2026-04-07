import * as React from 'react';

interface EmailProps {
  firstName1: string;
  firstName2?: string;
  waterSource: string;
  testResults: {
    hardness: string | number;
    tds: string | number;
    chlorine?: string | number;
    iron?: string | number;
  };
  savings: {
    soap: number;
    water: number;
    household: number;
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
  <div style={{ fontFamily: 'sans-serif', color: '#333', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
    <h1 style={{ color: '#1e3a8a', borderBottom: '2px solid #1e3a8a', paddingBottom: '10px' }}>
      Your Safe Water Solutions Report
    </h1>
    
    <p>Hi {firstName1}{firstName2 ? ` & ${firstName2}` : ''},</p>
    
    <p>It was a pleasure meeting with you. Based on our water analysis for your <strong>{waterSource}</strong>, here is a detailed summary of your results and the savings we identified for your home:</p>
    
    {/* Water Analysis Section */}
    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
      <h3 style={{ color: '#1e3a8a', marginTop: '0' }}>Water Analysis Snapshot</h3>
      <ul style={{ listStyle: 'none', padding: '0' }}>
        <li style={{ marginBottom: '8px' }}><strong>Hardness:</strong> {testResults.hardness} GPG</li>
        <li style={{ marginBottom: '8px' }}><strong>TDS:</strong> {testResults.tds} PPM</li>
        {testResults.chlorine && <li style={{ marginBottom: '8px' }}><strong>Chlorine:</strong> {testResults.chlorine} PPM</li>}
        {testResults.iron && <li style={{ marginBottom: '8px' }}><strong>Iron:</strong> {testResults.iron} PPM</li>}
      </ul>
    </div>

    {/* Savings Breakdown Section */}
    <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '12px', border: '1px solid #dcfce7' }}>
      <h3 style={{ color: '#166534', marginTop: '0' }}>Monthly Savings Found</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ padding: '8px 0', color: '#15803d' }}>Cleaning Products:</td>
            <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold' }}>${savings.soap.toFixed(2)}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px 0', color: '#15803d' }}>Bottled Water & Filters:</td>
            <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold' }}>${savings.water.toFixed(2)}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px 0', color: '#15803d', borderBottom: '1px solid #bbf7d0' }}>Household Water Impact:</td>
            <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold', borderBottom: '1px solid #bbf7d0' }}>${savings.household.toFixed(2)}</td>
          </tr>
          <tr>
            <td style={{ padding: '15px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#166534' }}>Total Monthly Savings:</td>
            <td style={{ padding: '15px 0 0 0', textAlign: 'right', fontSize: '22px', fontWeight: '900', color: '#166534' }}>
              ${savings.monthly.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style={{ textAlign: 'center', marginTop: '30px', padding: '20px', background: '#1e3a8a', borderRadius: '12px', color: '#fff' }}>
      <p style={{ margin: '0', textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>Estimated Yearly Savings</p>
      <p style={{ margin: '5px 0 0 0', fontSize: '32px', fontWeight: '900' }}>${savings.yearly.toFixed(2)}</p>
    </div>

    <p style={{ marginTop: '30px' }}>If you have any questions about these results or are ready to take the next steps toward high-quality water for your home, please reach out to us!</p>
    
    <p style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', fontSize: '14px', color: '#64748b' }}>
      Best regards,<br/>
      <strong style={{ color: '#1e3a8a' }}>The Safe Water Solutions Team</strong>
    </p>
  </div>
);