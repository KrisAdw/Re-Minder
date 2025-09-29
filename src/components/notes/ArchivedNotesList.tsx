"use client";
import { useNoteStore } from "@/stores/note.store";
import BaseNotesList from "./BaseNotesList";

const ArchiveNotesList = () => {
  const { setNotes, getArchivedNotes } = useNoteStore();

  return (
    <BaseNotesList
      archived={true}
      selector={getArchivedNotes}
      setNotes={setNotes}
    />
  );
};

export default ArchiveNotesList;
