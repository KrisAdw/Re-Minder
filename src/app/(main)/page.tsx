"use client";

import InputNote from "@/components/notes/InputNote";
import NotesList from "@/components/notes/NotesList";

const HomePage = () => {
  return (
    <main className="ml-16 lg:ml-0">
      <div className="max-w-5xl p-4 mx-auto">
        <div className="flex flex-col gap-8 md:gap-12">
          <InputNote />
          <NotesList />
        </div>
      </div>
    </main>
  );
};

export default HomePage;
