// app/(dashboard)/seller/rfqs/page.tsx
import Link from "next/link";

export default async function SellerRFQFeedPage() {
  const url = new URL("/api/seller/rfqs", process.env.NEXT_PUBLIC_APP_URL);
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    const txt = await res.text().catch(() => "<no body>");
    return <div className="p-8 text-red-600">Failed to load feed: {txt}</div>;
  }

  const json = await res.json();
  const tier1 = json.tiers?.tier1 ?? [];
  const tier2 = json.tiers?.tier2 ?? [];
  const tier3 = json.tiers?.tier3 ?? [];

  function row(item: any) {
    const rfq = item.rfq;
    return (
      <div key={rfq.id} className="p-4 border-b flex justify-between items-center">
        <div>
          <div className="font-medium">{rfq.title}</div>
          <div className="text-sm text-gray-600">
            {rfq.size} • {rfq.pipe_type} • {rfq.brand_preference || "Any brand"}
          </div>
          <div className="text-xs text-gray-500">{item.matched?.join(", ")}</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-700">{item.score} pts</div>
          <Link href={`/seller/rfqs/${rfq.id}`} className="text-blue-600 hover:underline">
            View →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">RFQ Feed</h1>

      <section>
        <h2 className="text-xl font-semibold mb-3">Tier 1 — Best matches</h2>
        {tier1.length === 0 ? <p className="text-gray-600">No Tier 1 matches currently.</p> : tier1.map(row)}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Tier 2 — Good matches</h2>
        {tier2.length === 0 ? <p className="text-gray-600">No Tier 2 matches currently.</p> : tier2.map(row)}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Tier 3 — Other opportunities</h2>
        {tier3.length === 0 ? <p className="text-gray-600">No Tier 3 matches currently.</p> : tier3.map(row)}
      </section>
    </div>
  );
}
