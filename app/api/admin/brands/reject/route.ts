// app/api/admin/brands/reject/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const body = await req.formData();
  const id = body.get("id") as string;

  const supabase = await createSupabaseServerClient();
  const { data: suggestion } = await supabase.from("brand_suggestions").select("*").eq("id", id).single();

  if (!suggestion) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // insert into brands
  const { error: brandErr } = await supabase.from("brands").insert([{ name: suggestion.suggested_name }]);
  if (brandErr) return NextResponse.json({ error: brandErr.message }, { status: 500 });

  // mark suggestion rejected
  await supabase.from("brand_suggestions").update({ status: "rejected", reviewed_by: null, reviewed_at: new Date() }).eq("id", id);

  return NextResponse.redirect(new URL("/admin/brands", req.url));
}
