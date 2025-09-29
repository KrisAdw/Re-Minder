"use client";

import { useState } from "react";
import { PanelTopClose, PanelTopOpen, PaintBucket } from "lucide-react";
import ActionButton from "../ui/ActionButton";
import ColorPicker from "../ui/ColorPicker";
import { NoteColor } from "@/constants/colors";

type DraftActionBarProps = {
  isArchived: boolean;
  onArchiveToggle: () => void;
  onColorChange?: (color: NoteColor) => void;
};

const DraftActionBar = ({
  isArchived,
  onArchiveToggle,
  onColorChange,
}: DraftActionBarProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex items-center gap-2">
      {/* Archive toggle */}
      <ActionButton
        icon={isArchived ? PanelTopClose : PanelTopOpen}
        title={isArchived ? "Unarchive Note" : "Archive Note"}
        onClick={onArchiveToggle}
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
                onColorChange?.(c);
                setOpen(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DraftActionBar;
