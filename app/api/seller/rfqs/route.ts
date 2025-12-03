// app/api/seller/rfqs/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Tiering strategy (C)
 * - Tier 1: strong match (same state OR exact attribute matches)
 * - Tier 2: neighboring state OR one attribute off (brand or size)
 * - Tier 3: weak match (same country / different state)
 *
 * We use a small neighbor map to decide Tier2 by state adjacency.
 */

const NEIGHBOR_STATE_MAP: Record<string, string[]> = {
  // small sample — expand for full-country coverage
  "Rajasthan": ["Haryana", "Gujarat", "Madhya Pradesh", "Punjab"],
  "Haryana": ["Rajasthan", "Punjab", "Delhi", "Uttar Pradesh"],
  "Delhi": ["Haryana", "Uttar Pradesh"],
  "Uttar Pradesh": ["Delhi", "Haryana", "Madhya Pradesh", "Bihar"],
  "Madhya Pradesh": ["Rajasthan", "Uttar Pradesh", "Chhattisgarh", "Maharashtra"],
  "Gujarat": ["Rajasthan", "Maharashtra"],
  "Punjab": ["Haryana", "Rajasthan"],
  "Maharashtra": ["Gujarat", "Madhya Pradesh"],
  // add more states as you need
};

function scoreRFQForSeller(rfq: any, cap: any) {
  // normalize
  const rfqBrand = (rfq.brand_preference || "").toString().toLowerCase();
  const capBrands = (cap.brands || cap.supported_brands || []).map((b: string) =>
    b?.toString().toLowerCase()
  );

  const weights = {
    brand: 20,
    pipe_type: 18,
    shape: 12,
    size: 12,
    thickness: 10,
    moq: 14,
    state: 14, // will be split into exact/neighbor
  };

  let score = 0;
  const matched: string[] = [];

  // 1) brand
  if (!rfqBrand || capBrands.includes(rfqBrand)) {
    score += weights.brand;
    matched.push("brand");
  }

  // 2) pipe_type (pipe_types or pipe_types key in capability_json)
  const capPipeTypes = (cap.pipe_types || cap.pipeTypes || []).map(String);
  if (!rfq.pipe_type || capPipeTypes.includes(rfq.pipe_type)) {
    score += weights.pipe_type;
    matched.push("pipe_type");
  }

  // 3) shape
  const capShapes = (cap.shapes || cap.pipe_shapes || []).map(String);
  if (!rfq.shape || capShapes.includes(rfq.shape)) {
    score += weights.shape;
    matched.push("shape");
  }

  // 4) size — capability may store sizes array or sizes.round etc.
  let sizeOk = false;
  if (!rfq.size) sizeOk = true;
  else {
    const sizes = cap.sizes || cap.sizes || [];
    // sizes might be array or object { round: [...], shs: [...] }
    if (Array.isArray(sizes)) {
      if (sizes.includes(rfq.size)) sizeOk = true;
    } else if (typeof sizes === "object" && sizes !== null) {
      if ((sizes.round || []).includes(rfq.size)) sizeOk = true;
      if ((sizes.shs || []).includes(rfq.size)) sizeOk = true;
      if ((sizes.rhs || []).includes(rfq.size)) sizeOk = true;
    }
    // fallback older columns
    if (!sizeOk && Array.isArray(cap.round_sizes) && cap.round_sizes.includes(rfq.size)) sizeOk = true;
    if (!sizeOk && Array.isArray(cap.shs_sizes) && cap.shs_sizes.includes(rfq.size)) sizeOk = true;
    if (!sizeOk && Array.isArray(cap.rhs_sizes) && cap.rhs_sizes.includes(rfq.size)) sizeOk = true;
  }
  if (sizeOk) {
    score += weights.size;
    matched.push("size");
  }

  // 5) thickness: if buyer provided thickness check against cap.thickness or cap.thickness_options
  let thicknessOk = false;
  if (!rfq.thickness_mm) thicknessOk = true;
  else {
    // cap.thickness can be json structure or array
    const tOpts = cap.thickness || cap.thickness_options || {};
    // if it's object (e.g. {round: ["1.2","1.6"]}) search arrays inside
    if (Array.isArray(tOpts)) {
      thicknessOk = tOpts.includes(String(rfq.thickness_mm));
    } else if (typeof tOpts === "object" && tOpts !== null) {
      for (const key of Object.keys(tOpts)) {
        if ((tOpts[key] || []).includes(String(rfq.thickness_mm))) {
          thicknessOk = true;
          break;
        }
      }
    }
    // if still false, be lenient and accept when unspecified by cap
    if (!thicknessOk && (tOpts === null || Object.keys(tOpts || {}).length === 0)) thicknessOk = true;
  }
  if (thicknessOk) {
    score += weights.thickness;
    matched.push("thickness");
  }

  // 6) MOQ
  const moqOk = !cap.moq_mt || !rfq.quantity || Number(rfq.quantity) >= Number(cap.moq_mt || 0);
  if (moqOk) {
    score += weights.moq;
    matched.push("moq");
  }

  // 7) State match / neighbor match
  let stateScore = 0;
  const rfqState = (rfq.delivery_state || "").toString();
  const capStates = (cap.delivery?.states || cap.service_states || []).map(String);

  if (!rfqState) {
    stateScore = weights.state;
    matched.push("state_any");
  } else if (capStates.includes(rfqState)) {
    // exact state match → full state weight
    stateScore = weights.state;
    matched.push("state_exact");
  } else {
    // neighbor check
    const neighbors = NEIGHBOR_STATE_MAP[rfqState] || [];
    const intersects = neighbors.some((n) => capStates.includes(n));
    if (intersects) {
      // neighbor → half state weight
      stateScore = Math.floor(weights.state / 2);
      matched.push("state_neighbor");
    } else {
      // no state relation → zero for state
      stateScore = 0;
    }
  }
  score += stateScore;

  return { score, matched };
}

export async function GET(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    // ensure user is seller
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    // fetch capability for logged in seller
    const { data: capRow, error: capErr } = await supabase
      .from("seller_capabilities")
      .select("*")
      .eq("seller_id", user.id)
      .single();

    if (capErr) {
      return NextResponse.json({ error: capErr.message }, { status: 500 });
    }

    // capability stored either in capability_json or columns — normalize to `cap`
    const cap = capRow?.capability_json ? capRow.capability_json : {
      moq_mt: capRow.moq_mt,
      brands: capRow.supported_brands,
      pipe_types: capRow.pipe_types,
      shapes: capRow.pipe_shapes,
      sizes: capRow.sizes,
      thickness: capRow.thickness_options,
      delivery: {
        states: capRow.service_states,
        cities: capRow.service_cities,
        pincodes: capRow.service_pincodes
      }
    };

    // fetch published RFQs (non-deleted)
    const { data: rfqs, error: rfqErr } = await supabase
      .from("rfqs")
      .select("*")
      .eq("status", "published")
      .eq("is_deleted", false)
      .order("created_at", { ascending: false })
      .limit(1000);

    if (rfqErr) {
      return NextResponse.json({ error: rfqErr.message }, { status: 500 });
    }

    // score each RFQ
    const scored = (rfqs || []).map((r: any) => {
      const { score, matched } = scoreRFQForSeller(r, cap);
      return { rfq: r, score, matched };
    });

    // sort desc score
    scored.sort((a, b) => b.score - a.score);

    // tier thresholds — tune if you like
    const tier1 = scored.filter((s) => s.score >= 75);
    const tier2 = scored.filter((s) => s.score >= 50 && s.score < 75);
    const tier3 = scored.filter((s) => s.score < 50);

    return NextResponse.json({ tiers: { tier1, tier2, tier3 }, all: scored });
  } catch (err: any) {
    console.error("seller feed error", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
