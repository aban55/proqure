// app/api/seller/rfqs/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    // fetch seller capability
    const { data: capData } = await supabase
      .from("seller_capabilities")
      .select("*")
      .eq("seller_id", user.id)
      .single();

    const capabilities = capData?.capability_json ?? capData ?? {};

    // fetch published, non-deleted RFQs
    const { data: rfqs, error: rfqErr } = await supabase
      .from("rfqs")
      .select("*")
      .eq("status", "published")
      .eq("is_deleted", false)
      .order("created_at", { ascending: false })
      .limit(200);

    if (rfqErr) return NextResponse.json({ error: rfqErr.message }, { status: 500 });

    // simple scoring function: reuse logic from match, but local and cheaper
    function scoreRFQ(rfq: any): { score: number; matched: string[] } {
      let score = 0;
      const matched: string[] = [];

      // MOQ
      if (!capabilities.moq_mt || Number(rfq.quantity || 0) >= Number(capabilities.moq_mt || 0)) { score += 20; matched.push("moq"); }

      // brand
      if (!rfq.brand_preference || (capabilities.brands && capabilities.brands.map((b: string) => b.toLowerCase()).includes((rfq.brand_preference || "").toLowerCase()))) {
        score += 25; matched.push("brand");
      }

      // material
      if (!rfq.pipe_type || (capabilities.materials && capabilities.materials.includes(rfq.pipe_type))) { score += 15; matched.push("type"); }

      // shape
      if (!rfq.shape || (capabilities.shapes && capabilities.shapes.includes(rfq.shape))) { score += 10; matched.push("shape"); }

      // size
      const sizesObj = capabilities.sizes || { round: capabilities.round_sizes, shs: capabilities.shs_sizes, rhs: capabilities.rhs_sizes };
      if (!rfq.size || (sizesObj && ((sizesObj.round || []).includes(rfq.size) || (sizesObj.shs || []).includes(rfq.size) || (sizesObj.rhs || []).includes(rfq.size)))) {
        score += 10; matched.push("size");
      }

      // simple thickness acceptance (if buyer didn't specify, ok)
      if (!rfq.thickness_mm) { score += 10; matched.push("thickness"); }
      else { score += 5; }

      // location: state match
      if (!rfq.delivery_state) { score += 5; matched.push("state"); }
      else if (capabilities.delivery && Array.isArray(capabilities.delivery.states) && capabilities.delivery.states.includes(rfq.delivery_state)) {
        score += 15; matched.push("state");
      } else { score += 2; }

      return { score, matched };
    }

    const scored = (rfqs || []).map((r: any) => ({ rfq: r, ...scoreRFQ(r) }));
    scored.sort((a: any, b: any) => b.score - a.score);

    const tier1 = scored.filter((s: any) => s.score >= 80);
    const tier2 = scored.filter((s: any) => s.score >= 60 && s.score < 80);
    const tier3 = scored.filter((s: any) => s.score < 60);

    return NextResponse.json({ tiers: { tier1, tier2, tier3 }, all: scored });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
