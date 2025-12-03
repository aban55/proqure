// app/(dashboard)/seller/rfqs/page.tsx

import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function SellerRFQsPage() {
  const supabase = createSupabaseServerClient();

  // Sellers see ONLY published RFQs
  const { data: rfqs, error } = await supabase
    .from("rfqs")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="p-8 text-red-600">Failed to load RFQs.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Available RFQs</h1>

      {rfqs.length === 0 ? (
        <p>No RFQs available.</p>
      ) : (
        <ul className="space-y-2">
          {rfqs.map((r) => (
            <li key={r.id}>
              <Link
                href={`/seller/rfqs/${r.id}`}
                className="underline"
              >
                {r.title} — Qty: {r.quantity}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
