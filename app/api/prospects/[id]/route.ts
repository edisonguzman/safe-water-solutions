import { NextResponse } from 'next/server';
import { sql } from '@/app/lib/db';
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Change 1: Define as a Promise
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    // Change 2: Await the params before using them
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const prospect = await sql`
      SELECT * FROM prospects 
      WHERE id = ${id} AND sales_rep_id = ${userId}
      LIMIT 1
    `;

    if (prospect.length === 0) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(prospect[0]);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch prospect' }, { status: 500 });
  }
}