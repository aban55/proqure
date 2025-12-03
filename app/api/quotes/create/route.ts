// app/api/quotes/create/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const { rfq_id, price_per_unit, total_price, lead_time_days, message } = body;

    const { data: rfq } = await supabase.from("rfqs").select("id,buyer_id,status,is_deleted").eq("id", rfq_id).single();
    if (!rfq) return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
    if (rfq.is_deleted) return NextResponse.json({ error: "RFQ removed" }, { status: 400 });

    // insert quote (RLS allows seller insert)
    const { data, error } = await supabase.from("quotes").insert([{
      rfq_id,
      seller_id: user.id,
      price: total_price ?? price_per_unit,
      notes: message,
      lead_time_days
    }]);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Optionally notify buyer via email/webhook here

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
