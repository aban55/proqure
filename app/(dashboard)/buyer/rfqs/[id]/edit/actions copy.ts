"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getRFQ(id: string) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("rfqs")
    .select("*")
    .eq("id", id)
    .eq("buyer_id", user.id)
    .single();

  return data ?? null;
}

export async function updateRFQ(id: string, updates: any) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("rfqs")
    .update(updates)
    .eq("id", id)
    .eq("buyer_id", user.id);

  return { error };
}
