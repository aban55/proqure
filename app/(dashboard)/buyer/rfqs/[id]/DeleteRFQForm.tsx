"use client";

import React from "react";

export default function DeleteRFQForm({ id }: { id: string }) {
  return (
    <form
      action={`/buyer/rfqs/${id}/delete`}
      method="post"
      onSubmit={(e) => {
        if (!confirm("Are you sure you want to delete this RFQ?")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="bg-red-600 text-white px-4 py-2 rounded mt-4 hover:bg-red-700"
      >
        Delete RFQ
      </button>
    </form>
  );
}
