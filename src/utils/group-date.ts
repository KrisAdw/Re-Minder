import { NoteItem } from "@/lib/api/notes.api";

export function groupNotesByDate(notes: NoteItem[]) {
  const sorted = [...notes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const formatter = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const grouped: Record<string, NoteItem[]> = {};

  for (const note of sorted) {
    const label = formatter.format(new Date(note.createdAt));
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(note);
  }

  return Object.entries(grouped).map(([date, items]) => ({
    date,
    items,
  }));
}
