// app/api/debug/run-match/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rfq_id = searchParams.get("rfq_id");
  if (!rfq_id) return NextResponse.json({ error: "rfq_id is required" });

  const res = await fetch(
    \`\${process.env.NEXT_PUBLIC_APP_URL}/api/match/rfq/\${rfq_id}\`,
    { method: "POST" }
  );

  const json = await res.json();
  return NextResponse.json(json);
}
