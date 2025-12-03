// app/(dashboard)/buyer/rfqs/[id]/quotes/page.tsx
import Link from "next/link";

export default async function RFQQuotesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const url = new URL(`/api/quotes/list?rfq_id=${id}`, process.env.NEXT_PUBLIC_APP_URL);
  const res = await fetch(url.toString(), { cache: "no-store" });
  const json = await res.json();
  const quotes = json.quotes ?? [];

  return (
    <div className="p-8">
      <Link href={`/buyer/rfqs/${id}`} className="text-blue-600">← Back to RFQ</Link>

      <h1 className="text-2xl font-bold mt-4">Quotes Received</h1>

      {quotes.length === 0 && <p className="text-gray-600 mt-4">No quotes yet.</p>}

      <div className="mt-6 space-y-4">
        {quotes.map((q: any) => (
          <div key={q.id} className="p-4 border rounded">
            <div><strong>Seller:</strong> {q.seller_id}</div>
            <div><strong>Price:</strong> {q.price}</div>
            <div><strong>Lead time:</strong> {q.lead_time_days} days</div>
            <div><strong>Notes:</strong> {q.notes}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
