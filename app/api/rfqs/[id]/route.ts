import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req, { params }) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("rfqs")
    .select("*")
    .eq("id", params.id)
    .eq("buyer_id", user.id)
    .single();

  return NextResponse.json({ data, error });
}
