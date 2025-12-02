// app/(auth)/login/page.tsx
"use client";

import React from "react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-12">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
      <form className="space-y-3 bg-white p-4 rounded shadow">
        <input placeholder="Email" className="w-full border rounded p-2" />
        <input placeholder="Password" type="password" className="w-full border rounded p-2" />
        <button className="w-full bg-slate-800 text-white py-2 rounded">Sign in</button>
      </form>

      <div className="mt-3 text-sm">
        <Link href="/signup" className="text-blue-600">Create account</Link> ·{" "}
        <Link href="/forgot-password" className="text-blue-600">Forgot password?</Link>
      </div>
    </div>
  );
}
