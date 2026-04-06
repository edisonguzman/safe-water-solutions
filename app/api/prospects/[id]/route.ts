import { NextResponse } from 'next/server';
import { sql } from '@/app/lib/db';
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Change to Promise
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    // YOU MUST AWAIT THIS
    const { id } = await params; 

    console.log("Fetching Prospect ID:", id); // Check your terminal for this!

    const result = await sql`
      SELECT * FROM prospects 
      WHERE id = ${id}
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Fetch Error:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, sessionClaims } = await auth();
    
    // 1. Check Authentication
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const isAdmin = (sessionClaims?.metadata as any)?.role === 'admin';

    // 2. Security Check: Reps can only delete their own leads. Admins delete anything.
    if (isAdmin) {
      await sql`DELETE FROM prospects WHERE id = ${id}`;
    } else {
      const result = await sql`
        DELETE FROM prospects 
        WHERE id = ${id} AND sales_rep_id = ${userId}
        RETURNING id
      `;
      
      // If nothing was returned, the rep tried to delete someone else's lead
      if (result.length === 0) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    return NextResponse.json({ success: true, message: "Prospect deleted" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const isAdmin = (sessionClaims?.metadata as any)?.role === 'admin';

    // 1. Security Check: Reps can only update their own leads unless they are an admin
    const checkOwnership = await sql`
      SELECT sales_rep_id FROM prospects WHERE id = ${id}
    `;

    if (checkOwnership.length === 0) {
      return NextResponse.json({ error: "Prospect not found" }, { status: 404 });
    }

    if (!isAdmin && checkOwnership[0].sales_rep_id !== userId) {
      return NextResponse.json({ error: "Forbidden: Not your lead" }, { status: 403 });
    }

    // 2. Perform the Update
    // We use a safe approach to update only the fields provided in the body
    const result = await sql`
      UPDATE prospects
      SET 
        first_name1 = ${body.first_name1 ?? sql`first_name1`},
        last_name1 = ${body.last_name1 ?? sql`last_name1`},
        first_name2 = ${body.first_name2 ?? sql`first_name2`},
        last_name2 = ${body.last_name2 ?? sql`last_name2`},
        email = ${body.email ?? sql`email`},
        phone = ${body.phone ?? sql`phone`},
        address = ${body.address ?? sql`address`},
        city = ${body.city ?? sql`city`},
        state = ${body.state ?? sql`state`},
        zip = ${body.zip ?? sql`zip`},
        water_source = ${body.water_source ?? sql`water_source`}
      WHERE id = ${id}
      RETURNING *;
    `;

    return NextResponse.json({ success: true, prospect: result[0] });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Failed to update record" }, { status: 500 });
  }
}