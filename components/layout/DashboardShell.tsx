"use client";

import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex gap-6 items-start">
      <div className="hidden md:block sticky top-6 self-start">
        <Sidebar />
      </div>

      <div className="flex-1">
        <Topbar />
        <div className="p-2">{children}</div>
      </div>
    </div>
  );
}
