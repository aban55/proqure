import { NextResponse, NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value ?? "";
        },
        set() {},
        remove() {},
      },
    }
  );

  const body = await request.json();
  const { id } = body;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { error } = await supabase
    .from("rfqs")
    .update({ status: "draft" })
    .eq("id", id)
    .eq("buyer_id", user.id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}

