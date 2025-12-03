import { getRFQ } from "../actions";
import ClientForm from "./ClientForm";
import Link from "next/link";

export default async function EditRFQPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const rfq = await getRFQ(id);

  if (!rfq) {
    return <div className="p-8 text-red-600">RFQ not found or access denied.</div>;
  }

  if (rfq.status !== "draft") {
    return (
      <div className="p-8 text-yellow-700">
        This RFQ has been <strong>{rfq.status}</strong> and can no longer be edited.
        <div className="mt-4">
          <Link href={`/buyer/rfqs/${rfq.id}`} className="text-blue-600 underline">
            ← Go back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <Link href={`/buyer/rfqs/${rfq.id}`} className="text-blue-600 underline">
        ← Back
      </Link>

      <h1 className="text-2xl font-bold mb-6">Edit RFQ</h1>

      <ClientForm rfq={rfq} />
    </div>
  );
}
