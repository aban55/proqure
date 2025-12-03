"use client";
import { useState } from "react";

export default function QuoteForm({ rfqId }: { rfqId: string }) {
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [leadTime, setLeadTime] = useState("7");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: any) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/quotes/create", {
      method: "POST",
      body: JSON.stringify({ rfq_id: rfqId, price_per_unit: Number(pricePerUnit), total_price: Number(totalPrice), lead_time_days: Number(leadTime), message })
    });
    const j = await res.json();
    setSaving(false);
    if (j.error) return alert("Error: " + j.error);
    alert("Quote submitted");
    // optionally redirect to seller quotes page
  }

  return (
    <form onSubmit={submit} className="max-w-lg space-y-4">
      <div>
        <label className="block text-sm">Price per unit</label>
        <input className="border p-2 w-full" value={pricePerUnit} onChange={(e) => setPricePerUnit(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm">Total price</label>
        <input className="border p-2 w-full" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm">Lead time (days)</label>
        <input className="border p-2 w-full" value={leadTime} onChange={(e) => setLeadTime(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm">Message</label>
        <textarea className="border p-2 w-full" value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>

      <button className="bg-green-600 text-white px-4 py-2 rounded" disabled={saving}>{saving ? "Sending..." : "Submit Quote"}</button>
    </form>
  );
}
