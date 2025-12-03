// app/(dashboard)/buyer/rfqs/[id]/undo/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/ssr";

export async function POST(request: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

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

  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Only allow undo if deleted_by matches or owner
  const { data: existing, error: existErr } = await supabase
    .from("rfqs")
    .select("id, buyer_id, is_deleted, deleted_by")
    .eq("id", id)
    .single();

  if (existErr || !existing) {
    return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
  }

  if (!existing.is_deleted) {
    return NextResponse.json({ success: true, alreadyActive: true });
  }

  if (existing.buyer_id !== auth.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { error: undoErr } = await supabase
    .from("rfqs")
    .update({
      is_deleted: false,
      deleted_at: null,
      deleted_by: null,
    })
    .eq("id", id);

  if (undoErr) {
    return NextResponse.json({ error: undoErr.message }, { status: 500 });
  }

  return NextResponse.redirect(new URL(`/buyer/rfqs/${id}`, request.url));
}
