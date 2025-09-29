"use client";

import { useEffect, useRef, useState } from "react";
import { Pin, PinOff, X } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { createNoteApi } from "@/lib/api/notes.api";
import { useNoteStore } from "@/stores/note.store";
import { toast } from "sonner";
import DraftActionBar from "./DraftActionBar";

const InputNote = () => {
  const { user } = useAuthStore();
  const { addNote } = useNoteStore();

  const [color, setColor] = useState("default");
  const [isPinned, setIsPinned] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isArchived, setIsArchived] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Reset form state
  const resetForm = () => {
    setIsExpanded(false);
    setTitle("");
    setContent("");
    setTags([]);
    setTagInput("");
    setIsPinned(false);
    setIsArchived(false);
    setColor("default");
  };

  // Auto-save on close (click outside or close button)
  const handleClose = async () => {
    if (!title.trim() && !content.trim()) {
      resetForm(); // kosong, ga usah save
      return;
    }

    try {
      const newNote = await createNoteApi({
        title,
        content,
        tags,
        isPinned,
        isArchived,
        color,
      });

      addNote(newNote);
      toast.success("Note saved!");
    } catch (err) {
      console.log("Error saving note");
      console.error("❌ Auto-save error:", err);
    } finally {
      resetForm();
    }
  };

  // Detect click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    // depend on form states
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, tags, isPinned, isArchived, color]);

  const handlePinnedClick = () => {
    const nextState = !isPinned;
    setIsPinned(nextState);
    toast.info(nextState ? "Note pinned" : "Note unpinned");
  };

  const handleArchiveClick = () => {
    const nextState = !isArchived;
    setIsArchived(nextState);
    toast.info(nextState ? "Note archived" : "Note unarchived");
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === " ") && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    } else if (e.key === "Backspace" && !tagInput) {
      e.preventDefault();
      setTags(tags.slice(0, -1));
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <div className="flex flex-col items-center w-full gap-4">
      <h1 className="font-normal">{`Hello, ${user?.name ?? "World"}`}</h1>
      <div
        ref={wrapperRef}
        className={`card-note-input w-full max-w-[700px] border border-graybg rounded-lg p-4`}
        style={{
          backgroundColor:
            color === "default" ? "var(--background)" : `var(--note-${color})`,
          borderColor:
            color === "default"
              ? "var(--border)"
              : `var(--note-${color})`,
        }}
      >
        {!isExpanded ? (
          <input
            type="text"
            placeholder="Take a note..."
            className="w-full bg-transparent outline-none"
            onFocus={() => setIsExpanded(true)}
          />
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xl placeholder:text-xl bg-transparent outline-none font-medium"
              />
              <button
                title={isPinned ? "Unpin note" : "Pin note"}
                className="p-2 rounded-full hover:bg-black/5 cursor-pointer"
                onClick={handlePinnedClick}
              >
                {isPinned ? <PinOff size={20} /> : <Pin size={20} />}
              </button>
            </div>

            <div
              className="flex flex-wrap items-center gap-2 border-b pb-1"
              style={{
                borderColor:
                  color === "default"
                    ? "var(--border)"
                    : `var(--note-${color}-border)`,
              }}
            >
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2 py-1 rounded-full border text-xs"
                  style={{borderColor: color === "default" ? "var(--graybg)" : `var(--note-${color}-border)`}}
                  
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-destructive"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={
                  tagInput
                    ? ""
                    : tags.length === 0
                    ? "Add label (optional)"
                    : "Add more..."
                }
                className="flex-1 bg-transparent placeholder:text-xs outline-none text-sm"
              />
            </div>

            <textarea
              placeholder="Take a note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full resize-none bg-transparent outline-none"
              rows={3}
            />

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <DraftActionBar
                  isArchived={isArchived}
                  onArchiveToggle={handleArchiveClick}
                  onColorChange={(c) => setColor(c)}
                />
              </div>

              <button
                className="cursor-pointer px-6 py-2 hover:bg-black/5 rounded-lg"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputNote;
