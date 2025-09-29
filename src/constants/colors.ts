export const NOTE_COLORS = [
  "default",
  "red",
  "blue",
  "green",
  "yellow",
  "purple",  
] as const;

export type NoteColor = (typeof NOTE_COLORS)[number];