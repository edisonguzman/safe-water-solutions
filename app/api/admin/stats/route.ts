import { NextResponse } from 'next/server';
import { sql } from '@/app/lib/db';
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId, sessionClaims } = await auth();

    // 1. Check if user is logged in
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Check if the user has the 'admin' role in their metadata
    // Note: sessionClaims.metadata requires the Clerk Session Token customization we discussed
    const metadata = sessionClaims?.metadata as { role?: string } | undefined;
    
    if (metadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }
    
    // 3. Fetch Stats
    const stats = await sql`
      SELECT 
        COUNT(*) as total_prospects,
        COUNT(DISTINCT sales_rep_id) as active_reps,
        AVG(NULLIF(hardness, '')::numeric) as avg_hardness,
        AVG(NULLIF(tds, '')::numeric) as avg_tds,
        SUM((NULLIF(weekly_grocery_bill, 0) * 4 * NULLIF(product_percentage, 0) * 0.75) + (NULLIF(monthly_bottled_water_cost, 0))) as total_monthly_savings_generated
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
    console.error("Admin Stats Error:", error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}