"use client";

import { useState } from "react";
import { updateRFQ } from "./actions";
import { useRouter } from "next/navigation";

export default function ClientForm({ rfq }: { rfq: any }) {
  const router = useRouter();

  const [form, setForm] = useState({
    title: rfq.title ?? "",
    description: rfq.description ?? "",
    category: rfq.category ?? "",
    quantity: Number(rfq.quantity ?? 0),
  });

  const [loading, setLoading] = useState(false);

  async function saveChanges() {
    if (!form.title.trim()) {
      alert("Title is required.");
      return;
    }

    setLoading(true);

    const result = await updateRFQ(rfq.id, {
      ...form,
      quantity: Number(form.quantity),
    });

    setLoading(false);

    if (result?.error) {
      alert("Error: " + result.error);
      return;
    }

    router.push(`/buyer/rfqs/${rfq.id}`);
  }

  return (
    <div className="space-y-4">
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
        type="number"
        placeholder="Quantity"
        value={form.quantity}
        onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
      />

      <button
        onClick={saveChanges}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded disabled:bg-gray-500"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
