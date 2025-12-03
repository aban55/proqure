export default function NewRFQPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Create New RFQ</h1>
      <p className="text-sm text-slate-600">This is the RFQ creation form placeholder.</p>

      <div className="bg-white p-4 rounded shadow">
        <label className="block mb-2 text-sm">Title</label>
        <input className="w-full border rounded p-2" placeholder="Enter RFQ title" />

        <label className="block mt-3 mb-2 text-sm">Description</label>
        <textarea className="w-full border rounded p-2" rows={4} placeholder="Details"></textarea>

        <div className="mt-4">
          <button className="px-4 py-2 bg-slate-800 text-white rounded">Save draft</button>
          <button className="ml-3 px-4 py-2 border rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
}
