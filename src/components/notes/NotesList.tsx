"use client";

import { useNoteStore } from "@/stores/note.store";
import BaseNotesList from "./BaseNotesList";

const NotesList = () => {
  const { setNotes, getActiveNotes } = useNoteStore();

  return (
    <BaseNotesList
      archived={false}
      selector={getActiveNotes}
      onArchiveLabel="Archive"
      setNotes={setNotes}
    />
  );
};

export default NotesList;
