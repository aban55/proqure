import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  // Use your working SSR-auth Supabase client
  const supabase = await createSupabaseServerClient();

  // Get the logged-in user (SSR)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ data: [], error: "Not logged in" });
  }

  // Fetch RFQs for this user
  const { data, error } = await supabase
    .from("rfqs")
    .select("*")
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ data, error });
}
