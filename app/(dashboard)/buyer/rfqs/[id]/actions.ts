"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

// ---------------------------
// GET RFQ (excluding deleted)
// ---------------------------
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
    .is("deleted_at", null)   // 👈 FIX: do not return soft deleted RFQs
    .single();

  return data;
}

// ---------------------------
// PUBLISH RFQ
// ---------------------------
export async function publishRFQ(id: string) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  // ensure user owns the RFQ
  const { data: rfq } = await supabase
    .from("rfqs")
    .select("buyer_id")
    .eq("id", id)
    .single();

  if (!rfq || rfq.buyer_id !== user.id)
    return { error: "Unauthorized" };

  await supabase
    .from("rfqs")
    .update({ status: "published" })
    .eq("id", id);

  return { success: true };
}

// ---------------------------
// UNPUBLISH RFQ
// ---------------------------
export async function unpublishRFQ(id: string) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data: rfq } = await supabase
    .from("rfqs")
    .select("buyer_id")
    .eq("id", id)
    .single();

  if (!rfq || rfq.buyer_id !== user.id)
    return { error: "Unauthorized" };

  await supabase
    .from("rfqs")
    .update({ status: "draft" })
    .eq("id", id);

  return { success: true };
}

// ---------------------------
// SOFT DELETE RFQ
// ---------------------------
export async function softDeleteRFQ(id: string) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("rfqs")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("buyer_id", user.id);

  if (error) return { error: error.message };

  return { success: true };
}

// ---------------------------
// UNDO DELETE RFQ
// ---------------------------
export async function undoDeleteRFQ(id: string) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("rfqs")
    .update({ deleted_at: null })
    .eq("id", id)
    .eq("buyer_id", user.id);

  if (error) return { error: error.message };

  return { success: true };
}

// ---------------------------
// Hard Delete Logic
// ---------------------------
export async function hardDeleteRFQ(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("rfqs")
    .delete()
    .eq("id", id)
    .eq("buyer_id", user.id);

  if (error) return { error: error.message };

  return { success: true };
}
