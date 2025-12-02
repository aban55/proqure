export default function BuyerDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Buyer Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white rounded shadow">RFQs: 0</div>
        <div className="p-4 bg-white rounded shadow">Quotes: 0</div>
        <div className="p-4 bg-white rounded shadow">Orders: 0</div>
      </div>

      <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
      <p>No activity yet.</p>
    </div>
  );
}
