// app/api/quotes/list/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rfq_id = searchParams.get("rfq_id");

  if (!rfq_id) return NextResponse.json({ error: "rfq_id is required" }, { status: 400 });

  const supabase = await createSupabaseServerClient();
  const { data: quotes, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("rfq_id", rfq_id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ quotes });
}
