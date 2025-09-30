/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useNoteStore } from "@/stores/note.store";
import {
  getNotesApi,
  listTrashApi,
  searchNotesApi,
  searchTrashApi,
} from "@/lib/api/notes.api";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const { setNotes } = useNoteStore();
  const pathname = usePathname();

  useEffect(() => {
    const timeout = setTimeout(async () => {
      let data: any[] = [];

      // kalau query kosong → fallback ambil semua
      if (!query.trim()) {
        if (pathname === "/") {
          data = await getNotesApi({ archived: false });
        } else if (pathname === "/archive") {
          data = await getNotesApi({ archived: true});
        } else if (pathname === "/trash") {
          const res = await listTrashApi({ page: 1, pageSize: 20 });
          data = res.items;
        }
        setNotes(data);
        return;
      }

      // kalau ada query → panggil search sesuai page
      if (pathname === "/") {
        data = await searchNotesApi(query, false);
      } else if (pathname === "/archive") {
        data = await searchNotesApi(query, true);
      } else if (pathname === "/trash") {
        data = await searchTrashApi(query);
      }

      setNotes(data);
    }, 300); // debounce biar ga spam API

    return () => clearTimeout(timeout);
  }, [query, pathname, setNotes]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setQuery("");
      e.currentTarget.blur();
    }
  };

  return (
    <div className="flex gap-3 items-center p-3 rounded-lg bg-secondary w-full max-w-lg">
      <Search size={20} className="text-muted-foreground flex-shrink-0" />
      <input
        type="text"
        placeholder="Search ..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-transparent focus:outline-none"
        onKeyDown={handleKeyDown}
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="flex items-center justify-center h-6 aspect-square rounded-full hover:bg-graybg cursor-pointer text-muted-foreground"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
