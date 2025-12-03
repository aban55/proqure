// app/(dashboard)/seller/rfqs/page.tsx
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function SellerRFQFeedPage() {
  // MUST await the Supabase client
  const supabase = await createSupabaseServerClient();

  // Fetch only published RFQs
  const { data: rfqs, error } = await supabase
    .from("rfqs")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return <div className="p-8 text-red-600">Failed to load RFQs</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Available RFQs</h1>

      {(rfqs?.length ?? 0) === 0 && (
        <p className="text-gray-600">No published RFQs available.</p>
      )}

      <div className="space-y-4">
        {rfqs?.map((r) => (
          <div key={r.id} className="border p-4 rounded shadow-sm">
            <h2 className="text-xl font-semibold">{r.title}</h2>

            <p className="text-gray-700">Category: {r.category}</p>
            <p className="text-gray-700">Qty: {r.quantity}</p>

            <Link
              href={`/seller/rfqs/${r.id}`}
              className="text-blue-600 underline mt-2 inline-block"
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
