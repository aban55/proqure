"use client";

import { Toaster } from "sonner";

export default function ToasterProvider() {
  // keep it minimal — customize position/theme as you like
  return <Toaster position="bottom-center" richColors />;
}
