import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing ID" });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return (
            req.headers
              .get("cookie")
              ?.split("; ")
              ?.find((c) => c.startsWith(name + "="))
              ?.split("=")[1] || ""
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Not logged in" });

  const { data, error } = await supabase
    .from("rfqs")
    .select("*")
    .eq("id", id)
    .eq("buyer_id", user.id)
    .single();

  return NextResponse.json({ data, error });
}
