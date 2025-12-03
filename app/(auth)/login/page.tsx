"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit() {
    setError("");

    const { error } = await supabaseBrowser.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    // SUCCESS → cookie is now set correctly
    window.location.href = "/buyer"; 
  }

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Login</h1>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <input
        className="border p-2 w-full mb-3"
        placeholder="Email"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-3"
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={submit}
        className="bg-blue-600 text-white w-full p-2 rounded"
      >
        Login
      </button>
    </div>
  );
}
