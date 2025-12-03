"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

// Fetch all non-deleted RFQs
export async function getRFQs() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("rfqs")
    .select("*")
    .eq("buyer_id", user.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  return data ?? [];
}

// Fetch only deleted RFQs
export async function getDeletedRFQs() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("rfqs")
    .select("*")
    .eq("buyer_id", user.id)
    .not("deleted_at", "is", null)
    .order("deleted_at", { ascending: false });

  return data ?? [];
}
