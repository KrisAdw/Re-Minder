import ArchivedNotesList from "@/components/notes/ArchivedNotesList";

const Archive = () => {
  return (
    <div className="ml-16 lg:ml-0">
      <div className="max-w-5xl p-4 mx-auto">
        <div className="flex flex-col gap-8 md:gap-12">
          <h2 className="text-center">Archived Notes</h2>
          <ArchivedNotesList />
        </div>
      </div>
    </div>
  );
};

export default Archive;
