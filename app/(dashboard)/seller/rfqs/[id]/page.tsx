// app/(dashboard)/seller/rfqs/[id]/page.tsx
import Link from "next/link";
import QuoteForm from "./QuoteForm"; // client component

export default async function RFQDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = new URL(`/api/rfqs/get?id=${id}`, process.env.NEXT_PUBLIC_APP_URL);
  const res = await fetch(url.toString(), { cache: "no-store" });
  const json = await res.json();
  const rfq = json.data;

  if (!rfq) return <div className="p-8 text-red-600">RFQ not found</div>;

  return (
    <div className="p-8">
      <Link href="/seller/rfqs" className="text-blue-600">← Back</Link>
      <h1 className="text-3xl font-bold mt-4">{rfq.title}</h1>
      <div className="mt-4 space-y-2">
        <div><strong>Size:</strong> {rfq.size}</div>
        <div><strong>Material:</strong> {rfq.pipe_type}</div>
        <div><strong>Quantity:</strong> {rfq.quantity}</div>
        <div><strong>Delivery State:</strong> {rfq.delivery_state}</div>
      </div>

      <div className="mt-6">
        <QuoteForm rfqId={rfq.id} />
      </div>
    </div>
  );
}
