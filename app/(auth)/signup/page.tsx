// app/(auth)/signup/page.tsx
"use client";

import React from "react";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="max-w-md mx-auto mt-12">
      <h1 className="text-2xl font-semibold mb-4">Create account</h1>
      <form className="space-y-3 bg-white p-4 rounded shadow">
        <input placeholder="Full name" className="w-full border rounded p-2" />
        <input placeholder="Email" className="w-full border rounded p-2" />
        <input placeholder="Password" type="password" className="w-full border rounded p-2" />
        <button className="w-full bg-slate-800 text-white py-2 rounded">Create account</button>
      </form>

      <div className="mt-3 text-sm">
        <Link href="/login" className="text-blue-600">Already have an account?</Link>
      </div>
    </div>
  );
}
