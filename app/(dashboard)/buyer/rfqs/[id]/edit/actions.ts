"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function updateRFQ(id: string, updates: any) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  // Make sure RFQ belongs to user + is draft
  const existing = await supabase
    .from("rfqs")
    .select("buyer_id, status")
    .eq("id", id)
    .single();

  if (!existing.data || existing.data.buyer_id !== user.id) {
    return { error: "Unauthorized" };
  }

  if (existing.data.status !== "draft") {
    return { error: "Cannot edit non-draft RFQs" };
  }

  const { error } = await supabase
    .from("rfqs")
    .update({
      title: updates.title,
      description: updates.description,
      category: updates.category,
      quantity: updates.quantity,
    })
    .eq("id", id);

  return { error };
}
