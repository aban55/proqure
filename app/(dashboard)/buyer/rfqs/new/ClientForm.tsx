"use client";

import { useState } from "react";
import { createRFQ } from "./actions";
import { useRouter } from "next/navigation";

export default function ClientForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    const result = await createRFQ(formData);

    if (!result.error) {
      router.push("/buyer/rfqs");
    }

    setLoading(false);
  }

  return (
    <form className="space-y-4" action={handleSubmit}>
      <input name="title" placeholder="Title" required className="border p-2 w-full" />
      <input name="category" placeholder="Category" required className="border p-2 w-full" />
      <input name="quantity" type="number" placeholder="Quantity" required className="border p-2 w-full" />
      <textarea name="description" placeholder="Description" className="border p-2 w-full" />

      <button
        type="submit"
        className="bg-purple-700 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Creating…" : "Create RFQ"}
      </button>
    </form>
  );
}
