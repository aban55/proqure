"use client";

import { hardDeleteRFQ } from "../[id]/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function HardDeleteButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Permanently delete this RFQ? This CANNOT be undone.")) {
      return;
    }

    const res = await hardDeleteRFQ(id);

    if (res.error) {
      toast.error(res.error);
      return;
    }

    toast.success("RFQ permanently deleted.");
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Delete Forever
    </button>
  );
}
