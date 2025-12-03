import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ data: [], error: "Not logged in" });
  }

  const { data, error } = await supabase
    .from("rfqs")
    .select("*")
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ data, error });
}
