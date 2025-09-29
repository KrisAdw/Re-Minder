import { create } from "zustand";
import { NoteItem } from "@/lib/api/notes.api";

type NoteState = {
  notes: NoteItem[];
  setNotes: (notes: NoteItem[]) => void;
  addNote: (note: NoteItem) => void;
  removeNote: (id: string) => void;
  updateNote: (note: NoteItem) => void;

  // Selectors
  getActiveNotes: () => NoteItem[];
  getArchivedNotes: () => NoteItem[];
  getPinnedNotes: () => NoteItem[];
  getTrashNotes: () => NoteItem[];
};

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],

  setNotes: (notes) => set({ notes }),

  addNote: (note) =>
    set((state) => {
      const newNotes = [note, ...state.notes];
      return { notes: sortNotes(newNotes) };
    }),

  updateNote: (note) =>
    set((state) => {
      const updatedNotes = state.notes.map((n) =>
        n.id === note.id ? note : n
      );
      return { notes: sortNotes(updatedNotes) };
    }),

  removeNote: (id: string) =>
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
    })),

  // Selectors
  getActiveNotes: () =>
    get().notes.filter((n) => !n.isArchived && !n.deletedAt),
  getArchivedNotes: () =>
    get().notes.filter((n) => n.isArchived && !n.deletedAt),
  getPinnedNotes: () =>
    get().notes.filter((n) => n.isPinned && !n.deletedAt),
  getTrashNotes: () =>
    get().notes.filter((n) => !!n.deletedAt),
}));

// ===== Helper untuk sorting =====
function sortNotes(notes: NoteItem[]) {
  return [...notes].sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1; // pinned dulu
    }
    return 0; // sisanya biarin urutan insert
  });
}
