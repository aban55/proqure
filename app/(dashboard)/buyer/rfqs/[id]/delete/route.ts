// app/(dashboard)/buyer/rfqs/[id]/delete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/ssr";

export async function POST(request: NextRequest, context: { params: { id: string } }) {
  try {
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

    const { data: auth, error: authErr } = await supabase.auth.getUser();
    if (authErr || !auth.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Confirm ownership
    const { data: existing, error: existErr } = await supabase
      .from("rfqs")
      .select("id, buyer_id, status, is_deleted")
      .eq("id", id)
      .single();

    if (existErr || !existing) {
      return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
    }

    if (existing.buyer_id !== auth.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (existing.is_deleted) {
      // already deleted
      return NextResponse.json({ success: true, alreadyDeleted: true });
    }

    // Only allow deleting drafts (or allow business rule)
    if (existing.status !== "draft") {
      return NextResponse.json({ error: "Only draft RFQs may be deleted" }, { status: 400 });
    }

    // Soft delete: set flags
    const { error: delErr } = await supabase
      .from("rfqs")
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        deleted_by: auth.user.id,
      })
      .eq("id", id);

    if (delErr) {
      return NextResponse.json({ error: delErr.message }, { status: 500 });
    }

    // Redirect back to list (server redirect)
    return NextResponse.redirect(new URL("/buyer/rfqs", request.url));
  } catch (err: any) {
    console.error("Delete RFQ error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
