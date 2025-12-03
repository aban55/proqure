"use client";

import { useState } from "react";

export default function NewRFQPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    quantity: "",
  });

  const [loading, setLoading] = useState(false);

  const submitRFQ = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/rfqs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quantity: Number(form.quantity ?? 0),
        }),
      });

      // Safe JSON parse
      let json: any = null;
      try {
        json = await res.json();
      } catch (e) {
        console.error("Invalid JSON returned by API:", e);
        alert("Server response invalid. Check console.");
        setLoading(false);
        return;
      }

      setLoading(false);

      if (!res.ok || json?.error) {
        alert("Error: " + (json?.error || "Failed to create RFQ"));
        return;
      }

      alert("RFQ created!");
      window.location.href = "/buyer/rfqs";
    } catch (err) {
      console.error("submitRFQ error:", err);
      setLoading(false);
      alert("Unexpected error. Check console.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Create New RFQ</h1>

      <div className="space-y-4 max-w-lg">
        <input
          className="w-full border p-2"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          className="w-full border p-2"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          className="w-full border p-2"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <input
          className="w-full border p-2"
          placeholder="Quantity"
          type="number"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />

        <button
          onClick={submitRFQ}
          className="bg-black text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Saving..." : "Create RFQ"}
        </button>
      </div>
    </div>
  );
}
