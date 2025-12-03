// app/api/debug/run-match/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rfq_id = searchParams.get("rfq_id");
    if (!rfq_id) {
      return NextResponse.json({ error: "rfq_id is required" }, { status: 400 });
    }

    const base = process.env.NEXT_PUBLIC_APP_URL;
    if (!base) {
      return NextResponse.json({ error: "NEXT_PUBLIC_APP_URL not set" }, { status: 500 });
    }

    // Build target URL safely
    const target = new URL(`/api/match/rfq/${encodeURIComponent(rfq_id)}`, base).toString();

    // Forward authorization header and cookies if present
    const headers: Record<string, string> = {};
    const auth = request.headers.get("authorization");
    if (auth) headers["authorization"] = auth;

    const cookie = request.headers.get("cookie");
    if (cookie) headers["cookie"] = cookie;

    const res = await fetch(target, {
      method: "POST",
      headers,
      // body: JSON.stringify({}) // uncomment + populate if upstream expects a JSON body
    });

    if (!res.ok) {
      const detail = await res.text();
      return NextResponse.json(
        { error: "Upstream request failed", status: res.status, detail },
        { status: 502 }
      );
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      const text = await res.text();
      return NextResponse.json({ warning: "Upstream returned non-JSON", body: text }, { status: 200 });
    }

    const json = await res.json();
    return NextResponse.json(json);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}
