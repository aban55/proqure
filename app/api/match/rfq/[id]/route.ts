// app/api/match/rfq/[id]/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type MatchResult = {
  seller_id: string;
  score: number;
  matched: string[];
  seller_capability: any;
};

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const rfqId = params.id;
    const supabase = await createSupabaseServerClient();

    // fetch rfq
    const { data: rfq, error: rfqErr } = await supabase
      .from("rfqs")
      .select("*")
      .eq("id", rfqId)
      .single();

    if (rfqErr || !rfq) {
      return NextResponse.json({ error: rfqErr?.message ?? "RFQ not found" }, { status: 404 });
    }

    // fetch all sellers' capabilities (in production you may paginate / filter by state first)
    const { data: sellers, error: sellersErr } = await supabase
      .from("seller_capabilities")
      .select("*");

    if (sellersErr) return NextResponse.json({ error: sellersErr.message }, { status: 500 });

    // optionally fetch size_thickness_map entries for this rfq to validate thickness
    const { data: stmRows } = await supabase
      .from("size_thickness_map")
      .select("*")
      .eq("pipe_type", rfq.pipe_type)
      .eq("shape", rfq.shape)
      .eq("size", rfq.size);

    const stm = stmRows?.[0] ?? null;

    // scoring weights (tunable)
    const weights = {
      moq: 20,
      brand: 25,
      pipe_type: 15,
      shape: 10,
      size: 10,
      thickness: 10,
      location_pincode: 15, // we use state/radius: split logic below
      state: 5,
    };

    const results: MatchResult[] = (sellers || []).map((s: any) => {
      let score = 0;
      const matched: string[] = [];

      // parse capability JSON if stored there
      const cap = s.capability_json ?? s; // support both shapes

      // MOQ check (assume rfq.quantity in same units as moq_mt)
      const moqOk = !cap.moq_mt || Number(rfq.quantity || 0) >= Number(cap.moq_mt || 0);
      if (moqOk) { score += weights.moq; matched.push("moq"); }

      // Brand check (if buyer specified)
      if (!rfq.brand_preference || (cap.brands && cap.brands.map((b: string) => b.toLowerCase()).includes((rfq.brand_preference || "").toLowerCase()))) {
        score += weights.brand;
        matched.push("brand");
      }

      // Pipe type
      if (!rfq.pipe_type || (cap.materials && cap.materials.includes(rfq.pipe_type))) {
        score += weights.pipe_type;
        matched.push("pipe_type");
      }

      // shape
      if (!rfq.shape || (cap.shapes && cap.shapes.includes(rfq.shape))) {
        score += weights.shape;
        matched.push("shape");
      }

      // size (check in proper size arrays)
      let sizeOk = false;
      if (!rfq.size) sizeOk = true;
      else {
        if (cap.sizes) {
          // if capability_json.sizes is an object with round/shs/rhs arrays:
          const sizesObj = cap.sizes || {};
          if ((sizesObj.round || []).includes(rfq.size) || (sizesObj.shs || []).includes(rfq.size) || (sizesObj.rhs || []).includes(rfq.size)) {
            sizeOk = true;
          }
        }
        if (!sizeOk) {
          // fallback older columns: round_sizes, shs_sizes, rhs_sizes
          if ((cap.round_sizes || []).includes(rfq.size) || (cap.shs_sizes || []).includes(rfq.size) || (cap.rhs_sizes || []).includes(rfq.size)) {
            sizeOk = true;
          }
        }
      }
      if (sizeOk) { score += weights.size; matched.push("size"); }

      // thickness validation using size_thickness_map (stm)
      let thicknessOk = false;
      if (!rfq.thickness_mm || !stm) {
        thicknessOk = true; // if buyer didn't ask thickness or we don't have map, don't penalize
      } else {
        const t = Number(rfq.thickness_mm);
        if (!isNaN(t) && (!stm.min_thickness || !stm.max_thickness || (t >= Number(stm.min_thickness) && t <= Number(stm.max_thickness)))) {
          thicknessOk = true;
        }
      }
      if (thicknessOk) { score += weights.thickness; matched.push("thickness"); }

      // location: check state match / radius (cap.delivery_json: states[], radius_km)
      let locationScore = 0;
      if (!rfq.delivery_state) {
        locationScore = weights.state; // no state provided so treat as ok
        matched.push("state");
      } else {
        if (cap.delivery && Array.isArray(cap.delivery.states) && cap.delivery.states.includes(rfq.delivery_state)) {
          locationScore = weights.state + Math.floor(weights.location_pincode / 2);
          matched.push("state");
          matched.push("location_strong");
        } else {
          // radius matching requires coordinates; skip heavy geocode for now
          // fallback: if seller has a radius and states cover same country assume partial
          if (cap.delivery && cap.delivery.radius_km) {
            locationScore = Math.floor(weights.state / 2);
            matched.push("location_near");
          }
        }
      }
      score += locationScore;

      return { seller_id: s.seller_id ?? s.seller_id || s.seller_id, score, matched, seller_capability: cap };
    });

    // sort by score desc
    results.sort((a, b) => b.score - a.score);

    // classify tiers: tune thresholds below
    const tier1 = results.filter(r => r.score >= 80);
    const tier2 = results.filter(r => r.score >= 60 && r.score < 80);
    const tier3 = results.filter(r => r.score < 60);

    return NextResponse.json({ rfqId, tiers: { tier1, tier2, tier3 }, all: results });
  } catch (err: any) {
    console.error("match error", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
