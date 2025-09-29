"use client";

import { useState } from "react";
import { NoteItem } from "@/lib/api/notes.api";
import ActionButton from "../ui/ActionButton";
import { PanelTopClose, PanelTopOpen, PaintBucket, Trash } from "lucide-react";
import ColorPicker from "../ui/ColorPicker";

type NoteActionBarProps = {
  note: NoteItem;
  onArchive: (noteId: string, current: boolean) => void;
  onDelete: (noteId: string) => void;
  onColorChange: (noteId: string, color: string) => void;
};

const NoteActionBar = ({
  note,
  onArchive,
  onDelete,
  onColorChange,
}: NoteActionBarProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex items-center gap-2">
      {/* Archive toggle */}
      <ActionButton
        icon={note.isArchived ? PanelTopClose : PanelTopOpen}
        title={note.isArchived ? "Unarchive Note" : "Archive Note"}
        onClick={() => onArchive(note.id, note.isArchived)}
      />

      {/* Color bucket */}
      <div className="relative">
        <ActionButton
          icon={PaintBucket}
          title="Change Color"
          onClick={() => setOpen((prev) => !prev)}
        />
        {open && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50">
            <ColorPicker
              onSelect={(c) => {
                onColorChange(note.id, c);
                setOpen(false);
              }}
            />
          </div>
        )}
      </div>

      {/* Delete */}
      <ActionButton
        icon={Trash}
        title="Delete Note"
        variant="destructive"
        onClick={() => onDelete(note.id)}
      />
    </div>
  );
};

export default NoteActionBar;
