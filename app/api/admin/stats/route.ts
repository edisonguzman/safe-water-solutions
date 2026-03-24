import { NextResponse } from 'next/server';
import { sql } from '@/app/lib/db';
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();
    // TODO: Add a check here to ensure the userId belongs to an Admin role
    
    const stats = await sql`
      SELECT 
        COUNT(*) as total_prospects,
        COUNT(DISTINCT sales_rep_id) as active_reps,
        AVG(hardness) as avg_hardness,
        AVG(tds) as avg_tds,
        SUM((weekly_grocery_bill * 4 * product_percentage * 0.75) + (monthly_bottled_water_cost)) as total_monthly_savings_generated
      FROM prospects
    `;

    const repPerformance = await sql`
      SELECT 
        sales_rep_id, 
        COUNT(*) as leads_count
      FROM prospects 
      GROUP BY sales_rep_id 
      ORDER BY leads_count DESC
    `;

    return NextResponse.json({
      summary: stats[0],
      reps: repPerformance
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
} 
const { sessionClaims } = await auth();

// Ensure the user has the 'admin' role in their metadata
if (sessionClaims?.metadata?.role !== 'admin') {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
}