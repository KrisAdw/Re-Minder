/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import {
  getNotesApi,
  NoteItem,
  updateNoteApi,
  deleteNoteApi,
} from "@/lib/api/notes.api";
import { useNoteStore } from "@/stores/note.store";
import Masonry from "react-masonry-css";
import CardNote from "@/components/notes/CardNote";
import { motion } from "framer-motion";
import NoNotes from "./NoNotes";
import Modal from "@/components/notes/CardModal";
import NoteActionBar from "./NoteActionBar";
import { Pin, PinOff, X } from "lucide-react";
import { toast } from "sonner";

type BaseNotesListProps = {
  archived: boolean;
  selector: () => NoteItem[];
  setNotes: (notes: NoteItem[]) => void;
};

const BaseNotesList = ({ archived, selector, setNotes }: BaseNotesListProps) => {
  const notes = selector();
  const { updateNote, removeNote } = useNoteStore();

  const [selectedNote, setSelectedNote] = useState<null | NoteItem>(null);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= FETCH =================
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await getNotesApi({ archived }); // ✅ fetch semua notes
      setNotes(data);
    } catch (err) {
      console.error("❌ Failed to fetch notes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [archived]);

  // ================= HANDLERS =================
  const saveNote = async (note: NoteItem) => {
    try {
      const updated = await updateNoteApi(note.id, {
        title: note.title,
        content: note.content,
        tags: note.tags,
        color: note.color,
        isPinned: note.isPinned,
        isArchived: note.isArchived,
      });
      updateNote(updated);
    } catch {
      toast.error("Failed to save note");
    }
  };

  const handleArchive = async (id: string, current: boolean) => {
    try {
      const updated = await updateNoteApi(id, { isArchived: !current });
      updateNote(updated);
      toast.success(updated.isArchived ? "Note archived" : "Note unarchived");
      setSelectedNote(null);
    } catch {
      toast.error("Failed to update archive state");
    }
  };

  const handleChangeColor = async (id: string, color: string) => {
    try {
      const updated = await updateNoteApi(id, { color });
      updateNote(updated);

      if (selectedNote?.id === id) {
        setSelectedNote({ ...selectedNote, color: updated.color });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to change color");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteNoteApi(id); // default soft delete
      toast.success(res.message);
      removeNote(id);
      setSelectedNote(null);
    } catch {
      toast.error("Failed to delete note");
    }
  };

  const handleAddTag = (tag: string) => {
    if (!selectedNote) return;
    setSelectedNote({
      ...selectedNote,
      tags: [...selectedNote.tags, tag],
    });
  };

  const handleRemoveTag = (i: number) => {
    if (!selectedNote) return;
    setSelectedNote({
      ...selectedNote,
      tags: selectedNote.tags.filter((_, idx) => idx !== i),
    });
  };

  const handleTogglePin = () => {
    if (!selectedNote) return;
    setSelectedNote({
      ...selectedNote,
      isPinned: !selectedNote.isPinned,
    });
  };

  const handleCloseModal = async () => {
    if (selectedNote) {
      await saveNote(selectedNote);
    }
    setSelectedNote(null);
  };

  // Auto-save selected note with debounce
  useEffect(() => {
    if (!selectedNote) return;

    const handler = setTimeout(() => {
      saveNote(selectedNote);
    }, 600);

    return () => clearTimeout(handler);
  }, [selectedNote]);

  // ================= RENDER =================
  if (!notes.length && !loading)
    return (
      <div className="flex items-center justify-center h-60">
        <NoNotes />
      </div>
    );

  const breakpoints = { default: 4, 1100: 3, 700: 2, 500: 1 };

  return (
    <>
      <Masonry
        breakpointCols={breakpoints}
        className="flex gap-4"
        columnClassName="flex flex-col gap-4"
      >
        {notes.map((note) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelectedNote(note)}
          >
            <CardNote
              title={note.title}
              content={note.content}
              tags={note.tags}
              createdAt={note.createdAt}
              color={note.color}
            />
          </motion.div>
        ))}
      </Masonry>

      {loading && <p className="text-center py-4">Loading...</p>}

      <Modal
        open={!!selectedNote}
        onClose={handleCloseModal}
        color={selectedNote?.color || "default"}
      >
        {selectedNote && (
          <div className="space-y-4">
            {/* Title + Pin */}
            <div className="flex items-center justify-between">
              <input
                value={selectedNote.title}
                onChange={(e) =>
                  setSelectedNote({ ...selectedNote, title: e.target.value })
                }
                className="w-full placeholder:text-xl text-xl font-semibold bg-transparent outline-none"
                placeholder="Title"
              />
              <button
                onClick={handleTogglePin}
                className="p-2 rounded-full hover:bg-black/5 cursor-pointer"
              >
                {selectedNote.isPinned ? (
                  <PinOff size={20} />
                ) : (
                  <Pin size={20} />
                )}
              </button>
            </div>

            {/* Content */}
            <textarea
              value={selectedNote.content}
              onChange={(e) =>
                setSelectedNote({ ...selectedNote, content: e.target.value })
              }
              className="w-full resize-none text-justify bg-transparent outline-none text-sm text-foreground"
              rows={5}
              placeholder="Take a note..."
            />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedNote.tags?.map((tag, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 px-2 py-1 rounded-full border text-xs"
                  style={{
                    borderColor:
                      selectedNote.color === "default"
                        ? "var(--graybg)"
                        : `var(--note-${selectedNote.color}-border)`,
                  }}
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(i)}
                    className="hover:text-destructive"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && tagInput.trim()) {
                    e.preventDefault();
                    handleAddTag(tagInput.trim());
                    setTagInput("");
                  }
                }}
                placeholder="Add label..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>

            {/* Action Bar */}
            <div className="mt-4 flex items-center justify-between">
              <NoteActionBar
                note={selectedNote}
                onArchive={(id) => handleArchive(id, selectedNote.isArchived)}
                onDelete={handleDelete}
                onColorChange={handleChangeColor}
              />

              <button
                onClick={handleCloseModal}
                className="px-4 py-2 cursor-pointer rounded-lg hover:bg-black/5"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default BaseNotesList;
