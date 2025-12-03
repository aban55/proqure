import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Next.js 16: params must be awaited in grouped segments
  const { id } = await context.params;

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // MUST use absolute URL
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // CHECK OWNERSHIP + STATUS
  const { data: existing, error } = await supabase
    .from("rfqs")
    .select("status, buyer_id")
    .eq("id", id)
    .single();

  if (!existing || existing.buyer_id !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (existing.status !== "draft") {
    return NextResponse.json(
      { error: "Only draft RFQs can be deleted" },
      { status: 400 }
    );
  }

  // DELETE
  await supabase.from("rfqs").delete().eq("id", id);

  // MUST use absolute URL
  return NextResponse.redirect(new URL("/buyer/rfqs", req.url));
}
