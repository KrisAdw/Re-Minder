"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";

const SearchBar = () => {
  const [query, setQuery] = useState("");
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
