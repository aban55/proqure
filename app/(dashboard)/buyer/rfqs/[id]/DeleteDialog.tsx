"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { softDeleteRFQ, undoDeleteRFQ } from "./actions";
import { useRouter } from "next/navigation";

export default function DeleteDialog({ rfqId }: { rfqId: string }) {
  const [open, setOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    const res = await softDeleteRFQ(rfqId);

    if (res.error) {
      alert("Error deleting: " + res.error);
      return;
    }

    setDeleted(true);
    router.refresh(); // refresh server page
  }

  async function handleUndo() {
    const res = await undoDeleteRFQ(rfqId);

    if (res.error) {
      alert("Error undoing delete: " + res.error);
      return;
    }

    setOpen(false);
    setDeleted(false);
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Delete RFQ
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete RFQ?</DialogTitle>
          </DialogHeader>

          {!deleted && (
            <>
              <p>This RFQ will be moved to Trash and can be undone.</p>

              <DialogFooter>
                <button onClick={() => setOpen(false)}>Cancel</button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </DialogFooter>
            </>
          )}

          {deleted && (
            <>
              <p>RFQ moved to Trash.</p>
              <DialogFooter>
                <button onClick={handleUndo}>Undo</button>
                <button
                  onClick={() => {
                    setOpen(false);
                    router.push("/buyer/rfqs");
                  }}
                >
                  Close
                </button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
