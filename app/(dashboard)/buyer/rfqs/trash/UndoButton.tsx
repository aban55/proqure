"use client";

import { undoDeleteRFQ } from "../[id]/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UndoButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleUndo() {
    const res = await undoDeleteRFQ(id);

    if (res.error) {
      toast.error(res.error);
      return;
    }

    toast.success("Restored successfully!");
    router.refresh();
  }

  return (
    <button
      onClick={handleUndo}
      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Undo
    </button>
  );
}
