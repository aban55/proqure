// app/api/admin/sellers/verify/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const body = await req.formData();
  const sellerId = body.get("seller_id") as string;
  const supabase = await createSupabaseServerClient();

  // Insert into sellers_verified
  await supabase.from("sellers_verified").insert([{ seller_id: sellerId, verified_by: null }]);
  return NextResponse.redirect(new URL("/admin/brands", req.url));
}
