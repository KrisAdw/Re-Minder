"use client";

import { useEffect, useState } from "react";
import { listTrashApi, restoreNoteApi, hardDeleteNoteApi } from "@/lib/api/notes.api";
import { toast } from "sonner";

type TrashItem = {
  id: string;
  title: string;
  deletedAt: string;
};

const TrashNotesList = () => {
  const [trash, setTrash] = useState<TrashItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrash = async () => {
    try {
      setLoading(true);
      const data = await listTrashApi({ page: 1, pageSize: 20 });
      setTrash(data.items);
    } catch {
      toast.error("Failed to load trash");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const handleRestore = async (id: string) => {
    try {
      await restoreNoteApi(id);
      toast.success("Note restored");
      fetchTrash();
    } catch {
      toast.error("Failed to restore note");
    }
  };

  const handleHardDelete = async (id: string) => {
    try {
      await hardDeleteNoteApi(id, { hard: true });
      toast.success("Note permanently deleted");
      fetchTrash();
    } catch {
      toast.error("Failed to delete permanently");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!trash.length) return <p className="text-center text-muted">Trash is empty</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {trash.map((note) => (
        <div
          key={note.id}
          className="p-3 rounded-lg border bg-background flex flex-col gap-3"
        >
          <span className="font-medium truncate">
            {note.title || "(Untitled note)"}
          </span>
          <span className="text-xs text-muted-foreground">
            Deleted at {new Date(note.deletedAt).toLocaleString()}
          </span>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => handleRestore(note.id)}
              className="px-2 py-1 text-sm rounded-md bg-secondary hover:bg-primary hover:text-white"
            >
              Restore
            </button>
            <button
              onClick={() => handleHardDelete(note.id)}
              className="px-2 py-1 text-sm rounded-md bg-destructive text-white"
            >
              Delete Forever
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrashNotesList;
