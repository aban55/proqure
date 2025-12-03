// app/api/match/rfq/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type MatchResult = {
  seller_id: string;
  score: number;
  matched: string[];
  seller_capability: any;
};

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: rfqId } = await context.params;

  try {
    const supabase = await createSupabaseServerClient();

    // 1) Fetch RFQ
    const { data: rfq, error: rfqErr } = await supabase
      .from("rfqs")
      .select("*")
      .eq("id", rfqId)
      .single();

    if (rfqErr || !rfq) {
      return NextResponse.json(
        { error: rfqErr?.message ?? "RFQ not found" },
        { status: 404 }
      );
    }

    // 2) Fetch seller capabilities
    const { data: sellers, error: sellersErr } = await supabase
      .from("seller_capabilities")
      .select("*");

    if (sellersErr)
      return NextResponse.json({ error: sellersErr.message }, { status: 500 });

    // 3) Fetch valid thickness range (optional)
    const { data: stmRows } = await supabase
      .from("size_thickness_map")
      .select("*")
      .eq("pipe_type", rfq.pipe_type)
      .eq("shape", rfq.shape)
      .eq("size", rfq.size);

    const stm = stmRows?.[0] ?? null;

    // Weightage model (can tune later)
    const weights = {
      moq: 20,
      brand: 25,
      pipe_type: 15,
      shape: 10,
      size: 10,
      thickness: 10,
      location_pincode: 15,
      state: 5,
    };

    // 4) Matching engine
    const results: MatchResult[] = (sellers || []).map((s: any) => {
      const cap = s; // stored directly in table; no JSON wrapper
      let score = 0;
      const matched: string[] = [];

      // ---- MOQ ----
      const moqOk =
        !cap.moq_mt ||
        Number(rfq.quantity || 0) >= Number(cap.moq_mt || 0);

      if (moqOk) {
        score += weights.moq;
        matched.push("moq");
      }

      // ---- Brand ----
      if (
        !rfq.brand_preference ||
        (cap.supported_brands || [])
          .map((b: string) => b.toLowerCase())
          .includes((rfq.brand_preference || "").toLowerCase())
      ) {
        score += weights.brand;
        matched.push("brand");
      }

      // ---- Pipe Type ----
      if (
        !rfq.pipe_type ||
        (cap.pipe_types || []).includes(rfq.pipe_type)
      ) {
        score += weights.pipe_type;
        matched.push("pipe_type");
      }

      // ---- Shape ----
      if (!rfq.shape || (cap.pipe_shapes || []).includes(rfq.shape)) {
        score += weights.shape;
        matched.push("shape");
      }

      // ---- Size ----
      let sizeOk = false;
      if (!rfq.size) sizeOk = true;
      else {
        if ((cap.sizes || []).includes(rfq.size)) sizeOk = true;
      }

      if (sizeOk) {
        score += weights.size;
        matched.push("size");
      }

      // ---- Thickness ----
      let thicknessOk = false;

      if (!rfq.thickness_mm || !stm) {
        thicknessOk = true;
      } else {
        const t = Number(rfq.thickness_mm);
        if (
          t >= Number(stm.min_thickness) &&
          t <= Number(stm.max_thickness)
        ) {
          thicknessOk = true;
        }
      }

      if (thicknessOk) {
        score += weights.thickness;
        matched.push("thickness");
      }

      // ---- Location Matching (State + Radius) ----
      let locationScore = 0;

      if (!rfq.delivery_state) {
        locationScore = weights.state;
        matched.push("state");
      } else {
        if (
          cap.service_states &&
          cap.service_states.includes(rfq.delivery_state)
        ) {
          locationScore = weights.state + Math.floor(weights.location_pincode / 2);
          matched.push("state");
          matched.push("location_strong");
        } else {
          // fallback radius matching
          locationScore = Math.floor(weights.state / 2);
          matched.push("location_near");
        }
      }

      score += locationScore;

      return {
        seller_id: s.seller_id,
        score,
        matched,
        seller_capability: cap,
      };
    });

    // 5) Sort results
    results.sort((a, b) => b.score - a.score);

    // 6) Tier classification
    const tier1 = results.filter((r) => r.score >= 80);
    const tier2 = results.filter((r) => r.score >= 60 && r.score < 80);
    const tier3 = results.filter((r) => r.score < 60);

    return NextResponse.json({
      rfqId,
      tiers: { tier1, tier2, tier3 },
      all: results,
    });
  } catch (err: any) {
    console.error("match error", err);
    return NextResponse.json(
      { error: err.message || String(err) },
      { status: 500 }
    );
  }
}
