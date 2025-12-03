// app/api/admin/brands/pending/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  // only admins can hit this (RLS should also protect server-side)
  const { data: suggestions } = await supabase.from("brand_suggestions").select("*").eq("status", "pending");
  return NextResponse.json({ suggestions });
}
