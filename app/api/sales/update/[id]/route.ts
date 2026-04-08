import { sql } from "@/app/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    const body = await request.json();

    // Data Cleaning
    const cleanSaleDate = body.sale_date && body.sale_date !== "" ? body.sale_date : null;
    const cleanInstallDate = body.install_date && body.install_date !== "" ? body.install_date : null;
    const cleanSalePrice = parseFloat(body.sale_price) || 0;
    const cleanAmountFunded = parseFloat(body.amount_funded) || 0;
    const cleanSwsPaid = parseFloat(body.sws_paid) || 0;
    const cleanRepPaid = parseFloat(body.rep_paid) || 0;

    // Database Update (REMOVED updated_at to match your schema)
    await sql`
      UPDATE prospects 
      SET 
        lead_source = ${body.lead_source || 'Other'},
        sale_date = ${cleanSaleDate},
        sale_price = ${cleanSalePrice},
        finance_company = ${body.finance_company || null},
        amount_funded = ${cleanAmountFunded},
        sale_status = ${body.sale_status || 'Pending'},
        sws_paid = ${cleanSwsPaid},
        rep_paid = ${cleanRepPaid},
        letter_grade = ${body.letter_grade || null},
        eq_type = ${body.eq_type || null},
        install_date = ${cleanInstallDate}
      WHERE id = ${id}
    `;

    revalidatePath("/dashboard/sales");
    revalidatePath("/dashboard/analytics");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("SALES_UPDATE_ERROR:", error.message);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: error.message 
    }, { status: 500 });
  }
}