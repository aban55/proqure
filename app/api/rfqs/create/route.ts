import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req) {
  const supabase = await createSupabaseServerClient();
  const body = await req.json();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("rfqs")
    .insert({
      ...body,
      buyer_id: user.id,
      status: "draft",
    })
    .select()
    .single();

  return NextResponse.json({ data, error });
}
