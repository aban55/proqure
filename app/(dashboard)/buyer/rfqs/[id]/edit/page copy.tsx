import { getRFQ } from "../actions";
import ClientForm from "./ClientForm";

export default async function EditRFQPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // Next.js 16 requires await

  const rfq = await getRFQ(id);

  if (!rfq) {
    return <div className="p-8 text-red-600">RFQ not found.</div>;
  }

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Edit RFQ</h1>
      <ClientForm rfq={rfq} />
    </div>
  );
}
