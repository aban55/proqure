import Link from "next/link";
import { getRFQ, publishRFQ, unpublishRFQ } from "./actions";
import DeleteDialog from "./DeleteDialog";

export default async function RFQDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rfq = await getRFQ(id);

  if (!rfq) {
    return <div className="p-8 text-red-600">RFQ not found.</div>;
  }

  return (
    <div className="p-8 space-y-8">
      {/* Back link */}
      <Link href="/buyer/rfqs" className="text-blue-600 hover:underline">
        ← Back to My RFQs
      </Link>

      {/* Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{rfq.title}</h1>

        {/* Delete + Edit (only for draft) */}
        <div className="flex gap-4">
          {rfq.status === "draft" && <DeleteDialog rfqId={rfq.id} />}

          {rfq.status === "draft" && (
            <Link
              href={`/buyer/rfqs/${rfq.id}/edit`}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit RFQ
            </Link>
          )}
        </div>
      </div>

      {/* RFQ Details */}
      <div className="space-y-2 text-lg">
        <p>
          <strong>Category:</strong> {rfq.category}
        </p>
        <p>
          <strong>Quantity:</strong> {rfq.quantity}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={
              "px-2 py-1 rounded text-white " +
              (rfq.status === "published"
                ? "bg-green-600"
                : rfq.status === "draft"
                ? "bg-gray-600"
                : "bg-red-600")
            }
          >
            {rfq.status}
          </span>
        </p>
        <p>
          <strong>Description:</strong> {rfq.description}
        </p>
      </div>

      {/* View Quotes Button */}
      <Link
        href={`/buyer/rfqs/${rfq.id}/quotes`}
        className="bg-blue-600 text-white px-4 py-2 rounded inline-block mt-4 hover:bg-blue-700"
      >
        View Quotes
      </Link>

      {/* Publish / Unpublish */}
      <div className="flex gap-4 mt-6">
        {rfq.status === "draft" && (
          <form
            action={async () => {
              "use server";
              await publishRFQ(id);
            }}
          >
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Publish RFQ
            </button>
          </form>
        )}

        {rfq.status === "published" && (
          <form
            action={async () => {
              "use server";
              await unpublishRFQ(id);
            }}
          >
            <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
              Unpublish RFQ
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
