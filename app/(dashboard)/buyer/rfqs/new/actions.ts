"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function createRFQ(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const quantity = Number(formData.get("quantity"));

  const { data, error } = await supabase
    .from("rfqs")
    .insert({
      title,
      category,
      description,
      quantity,
      buyer_id: user.id,
      status: "draft",
    })
    .select()
    .single();

  return { data, error };
}
