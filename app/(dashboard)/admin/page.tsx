// app/(dashboard)/admin/page.tsx
import React from "react";
import DashboardShell from "@/components/layout/DashboardShell";

export default function AdminDashboardPage() {
  return (
    <DashboardShell>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded shadow">Pending companies</div>
          <div className="p-4 bg-white rounded shadow">RFQ moderation</div>
          <div className="p-4 bg-white rounded shadow">System metrics</div>
        </div>
      </div>
    </DashboardShell>
  );
}
