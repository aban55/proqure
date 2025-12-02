// app/(auth)/forgot-password/page.tsx
"use client";

import React from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="max-w-md mx-auto mt-12">
      <h1 className="text-2xl font-semibold mb-4">Reset password</h1>
      <form className="space-y-3 bg-white p-4 rounded shadow">
        <input placeholder="Email" className="w-full border rounded p-2" />
        <button className="w-full bg-slate-800 text-white py-2 rounded">Send reset link</button>
      </form>

      <div className="mt-3 text-sm">
        <Link href="/login" className="text-blue-600">Back to sign in</Link>
      </div>
    </div>
  );
}
