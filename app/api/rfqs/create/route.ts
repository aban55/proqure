// app/api/rfqs/create/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const body = await req.json();

  const {
    title,
    description,
    category,
    quantity,
    brand_preference,
    pipe_type,
    shape,
    size,
    thickness_mm,
    delivery_state,
  } = body;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const { data, error } = await supabase.from("rfqs").insert([
    {
      buyer_id: user.id,
      title,
      description,
      category,
      quantity,
      brand_preference,
      pipe_type,
      shape,
      size,
      thickness_mm,
      delivery_state,
      status: "draft",
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}
