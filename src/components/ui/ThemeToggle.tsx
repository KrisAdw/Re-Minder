"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Biar aman dari hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="cursor-pointer flex items-center hover:bg-secondary p-2 justify-center rounded-full text-foreground"
    >
      {theme === "dark" ? <Sun size={20}/> : <Moon size={20}/>}
    </button>
  );
}

export default ThemeToggle;
