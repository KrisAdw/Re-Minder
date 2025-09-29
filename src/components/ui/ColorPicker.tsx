"use client";

import { NOTE_COLORS, NoteColor } from "@/constants/colors";

type ColorPickerProps = {
  colors?: readonly NoteColor[];
  onSelect: (color: NoteColor) => void;
};


const ColorPicker = ({ colors = NOTE_COLORS, onSelect }: ColorPickerProps) => {
  return (
    <div className="flex gap-2 p-2 bg-popover rounded-lg shadow">
      {colors.map((c) => (
        <button
          key={c}
          className="w-6 h-6 rounded-full border hover:scale-110 cursor-pointer transition"
          style={{
            backgroundColor:
              c === "default" ? "var(--background)" : `var(--note-${c})`,
          }}
          title={c}
          onClick={() => onSelect(c)}
        />
      ))}
    </div>
  );
};

export default ColorPicker;
