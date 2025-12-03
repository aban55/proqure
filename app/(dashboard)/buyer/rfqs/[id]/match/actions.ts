"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function matchSellers(rfqId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.rpc(
    "match_sellers_for_rfq",
    { rfq_id: rfqId }
  );

  if (error) {
    console.error("RPC Error:", error);
    return [];
  }

  return data;
}
