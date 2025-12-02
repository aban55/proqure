// app/(dashboard)/seller/page.tsx
import React from "react";
import DashboardShell from "@/components/layout/DashboardShell";

export default function SellerDashboardPage() {
  return (
    <DashboardShell>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Seller Dashboard</h1>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded shadow">Open RFQs</div>
          <div className="p-4 bg-white rounded shadow">Your Quotes</div>
          <div className="p-4 bg-white rounded shadow">Orders</div>
        </div>
      </div>
    </DashboardShell>
  );
}
