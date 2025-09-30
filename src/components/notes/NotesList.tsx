"use client";

import { useNoteStore } from "@/stores/note.store";
import BaseNotesList from "./BaseNotesList";

const NotesList = () => {
  const { setNotes, getActiveNotes } = useNoteStore();

  return (
    <BaseNotesList
      archived={false}
      selector={getActiveNotes}      
      setNotes={setNotes}
    />
  );
};

export default NotesList;
