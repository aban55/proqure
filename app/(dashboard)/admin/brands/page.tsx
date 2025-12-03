// app/(dashboard)/admin/brands/page.tsx
import Link from "next/link";

export default async function AdminBrandsPage() {
  const url = new URL("/api/admin/brands/pending", process.env.NEXT_PUBLIC_APP_URL);
  const res = await fetch(url.toString(), { cache: "no-store" });
  const json = await res.json();
  const suggestions = json.suggestions || [];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Brand Suggestions</h1>
      <div className="mt-6 space-y-4">
        {suggestions.length === 0 ? <p>No pending suggestions.</p> : suggestions.map((s:any) => (
          <div key={s.id} className="p-3 border rounded flex justify-between">
            <div>
              <div className="font-medium">{s.suggested_name}</div>
              <div className="text-sm text-gray-600">By: {s.seller_id}</div>
            </div>
            <div className="flex gap-2">
              <form action={`/api/admin/brands/approve`} method="post">
                <input type="hidden" name="id" value={s.id} />
                <button className="bg-green-600 text-white px-3 py-1 rounded">Approve</button>
              </form>
              <form action={`/api/admin/brands/reject`} method="post">
                <input type="hidden" name="id" value={s.id} />
                <button className="bg-red-600 text-white px-3 py-1 rounded">Reject</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
