import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const body = await req.json();
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not logged in" });

  const { error } = await supabase
    .from("seller_capabilities")
    .upsert({ seller_id: user.id, capability_json: body });

  return NextResponse.json({ success: true, error });
}
