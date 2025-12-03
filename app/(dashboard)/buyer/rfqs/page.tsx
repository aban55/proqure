import { getRFQs } from "./actions";
import Link from "next/link";

export default async function RFQListPage() {
  const rfqs = await getRFQs();

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">My RFQs</h1>

          {/* ⭐ Trash Link */}
          <Link
            href="/buyer/rfqs/trash"
            className="text-sm text-red-600 underline hover:text-red-700"
          >
            Trash →
          </Link>
        </div>

        {/* Create Button */}
        <Link
          href="/buyer/rfqs/new"
          className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
        >
          + Create RFQ
        </Link>
      </div>

      {/* EMPTY STATE */}
      {rfqs.length === 0 && (
        <p className="text-gray-600">No RFQs found.</p>
      )}

      {/* TABLE */}
      {rfqs.length > 0 && (
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="text-left p-2">Title</th>
              <th className="text-left p-2">Category</th>
              <th className="text-left p-2">Qty</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Created</th>
              <th className="text-left p-2"></th>
            </tr>
          </thead>

          <tbody>
            {rfqs.map((rfq: any) => (
              <tr key={rfq.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{rfq.title}</td>
                <td className="p-2">{rfq.category}</td>
                <td className="p-2">{rfq.quantity}</td>
                <td className="p-2 capitalize">{rfq.status}</td>
                <td className="p-2">
                  {new Date(rfq.created_at).toLocaleDateString()}
                </td>
                <td className="p-2">
                  <Link
                    href={`/buyer/rfqs/${rfq.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
