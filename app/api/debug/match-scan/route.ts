// app/api/debug/match-scan/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const { data: rfqs } = await supabase.from("rfqs").select("*");
  const { data: caps } = await supabase.from("seller_capabilities").select("*");

  const matrix: any[] = [];

  for (const r of rfqs || []) {
    for (const s of caps || []) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/match/rfq/${r.id}`,
        { method: "POST" }
      );
      const json = await res.json();
      const all = json.all ?? [];
      const sellerRes = all.find((a: any) => a.seller_id === s.seller_id);

      matrix.push({
        rfq: r.id,
        seller: s.seller_id,
        score: sellerRes?.score ?? 0,
        matched: sellerRes?.matched ?? []
      });
    }
  }

  return NextResponse.json({ matrix });
}
