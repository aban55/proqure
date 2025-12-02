"use client";

import React from "react";

export default function GlobalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-[1400px] mx-auto p-4">{children}</main>
    </div>
  );
}
