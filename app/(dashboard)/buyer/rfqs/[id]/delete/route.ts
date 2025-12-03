// app/(dashboard)/buyer/rfqs/[id]/delete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // MUST await in Next.js 16

    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Soft delete
    const { error } = await supabase
      .from("rfqs")
      .update({ is_deleted: true })
      .eq("id", id)
      .eq("buyer_id", user.id);

    if (error) {
      console.error("RFQ delete error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Delete route crash:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
