import { NextResponse } from 'next/server';
import { sql } from '@/app/lib/db';
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const prospect = await sql`
      SELECT * FROM prospects 
      WHERE id = ${params.id} AND sales_rep_id = ${userId}
      LIMIT 1
    `;

    if (prospect.length === 0) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(prospect[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch prospect' }, { status: 500 });
  }
}