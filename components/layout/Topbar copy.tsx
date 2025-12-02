"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Topbar() {
  return (
    <header className="h-16 border-b bg-white px-6 flex items-center justify-between">
      <div className="text-gray-600 text-sm font-medium">
        Buyer / Seller Procurement
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
