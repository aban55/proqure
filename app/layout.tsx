// app/layout.tsx
import "./globals.css";
import React from "react";
import GlobalLayout from "@/components/layout/GlobalLayout";

export const metadata = {
  title: "Proqure",
  description: "Procurment MVP",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GlobalLayout>{children}</GlobalLayout>
      </body>
    </html>
  );
}
