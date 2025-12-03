import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: Request) {
  const body = await req.json();
  const { id, title, description, category, quantity } = body;

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

  // Only allow editing drafts
  const existing = await supabase
    .from("rfqs")
    .select("status")
    .eq("id", id)
    .eq("buyer_id", user.id)
    .single();

  if (existing.data?.status !== "draft") {
    return NextResponse.json({
      error: "Cannot edit a published RFQ",
    });
  }

  const { data, error } = await supabase
    .from("rfqs")
    .update({
      title,
      description,
      category,
      quantity,
    })
    .eq("id", id)
    .eq("buyer_id", user.id)
    .select()
    .single();

  return NextResponse.json({ data, error });
}
