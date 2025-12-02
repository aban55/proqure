export default function BuyerDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Buyer Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white shadow rounded">RFQs: 0</div>
        <div className="p-4 bg-white shadow rounded">Quotes: 0</div>
        <div className="p-4 bg-white shadow rounded">Orders: 0</div>
      </div>

      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
        <p>No activity yet.</p>
      </div>
    </div>
  );
}
