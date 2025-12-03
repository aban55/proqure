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
  const { tier1 = [], tier2 = [], tier3 = [] } = json.tiers ?? {};

  function renderRow(item: any) {
    const rfq = item.rfq;
    return (
      <div key={rfq.id} className="p-3 border-b flex justify-between">
        <div>
          <div className="font-medium">{rfq.title}</div>
          <div className="text-sm text-gray-600">{rfq.category} • {rfq.size} • {rfq.pipe_type}</div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/seller/rfqs/${rfq.id}`} className="text-blue-600">View →</Link>
          <div className="text-sm text-gray-500">{item.score} pts</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Seller RFQ Feed</h1>

      <section>
        <h2 className="text-xl font-semibold mb-3">Best Matches (Tier 1)</h2>
        {tier1.length === 0 ? <p className="text-gray-600">No Tier 1 matches right now.</p> : tier1.map(renderRow)}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Partial Matches (Tier 2)</h2>
        {tier2.length === 0 ? <p className="text-gray-600">No Tier 2 matches right now.</p> : tier2.map(renderRow)}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Other Opportunities (Tier 3)</h2>
        {tier3.length === 0 ? <p className="text-gray-600">No Tier 3 matches.</p> : tier3.map(renderRow)}
      </section>
    </div>
  );
}
