import { NextResponse } from 'next/server';
import { sql } from '@/app/lib/db';
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    // Fetch prospects assigned to the logged-in rep
    const prospects = await sql`
      SELECT * FROM prospects 
      WHERE sales_rep_id = ${userId} 
      ORDER BY created_at DESC
    `;

    return NextResponse.json(prospects);
  } catch (error) {
    console.error('Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}