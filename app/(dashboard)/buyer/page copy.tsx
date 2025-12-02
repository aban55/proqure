// app/(dashboard)/buyer/page.tsx
import React from "react";
import DashboardShell from "@/components/layout/DashboardShell";

export default function BuyerDashboardPage() {
  return (
    <DashboardShell>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Buyer Dashboard</h1>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded shadow">RFQs: 0</div>
          <div className="p-4 bg-white rounded shadow">Quotes: 0</div>
          <div className="p-4 bg-white rounded shadow">Orders: 0</div>
        </div>

        <section className="mt-4 bg-white p-4 rounded shadow">
          <h2 className="font-semibold">Recent activity</h2>
          <p className="text-sm text-slate-500">No activity yet.</p>
        </section>
      </div>
    </DashboardShell>
  );
}
