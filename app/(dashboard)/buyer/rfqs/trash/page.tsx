import Link from "next/link";
import { getDeletedRFQs } from "../actions";
import UndoButton from "./UndoButton";
import HardDeleteButton from "./HardDeleteButton";

export default async function TrashPage() {
  const rfqs = await getDeletedRFQs();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Trash (Archived RFQs)</h1>

      <Link
        href="/buyer/rfqs"
        className="text-blue-600 hover:underline block mb-4"
      >
        ← Back to My RFQs
      </Link>

      {rfqs.length === 0 && (
        <p className="text-gray-600">Trash is empty.</p>
      )}

      {rfqs.length > 0 && (
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Deleted At</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rfqs.map((rfq) => (
              <tr key={rfq.id} className="border-b">
                <td className="p-2">{rfq.title}</td>
                <td className="p-2">
                  {new Date(rfq.deleted_at).toLocaleString()}
                </td>
                <td className="p-2 flex gap-4">
                  <UndoButton id={rfq.id} />
                  <HardDeleteButton id={rfq.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
