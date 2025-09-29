"use client";

import { motion } from "framer-motion";
import { NotebookText, Archive, Trash } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menu = [
    { icon: <NotebookText size={20} />, label: "Notes", href: "/" },
    { icon: <Archive size={20} />, label: "Archive", href: "/archive" },
    { icon: <Trash size={20} />, label: "Trash", href: "/trash" },
  ];

  return (
    <motion.aside
      initial={{ width: 64 }}
      onHoverStart={() => setIsOpen(true)}
      onHoverEnd={() => setIsOpen(false)}
      animate={{ width: isOpen ? 224 : 64 }} // 64px → 224px
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-16 z-40 h-[calc(100dvh-4rem)] border-border bg-background pt-3"
    >
      <nav className="flex h-full flex-col">
        {menu.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              href={item.href}
              key={item.label}
              className={`mb-2 mx-3 flex cursor-pointer items-center rounded-full h-12 min-w-12 transition-colors ${
                isActive
                  ? "bg-bluehov text-white"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              <div className="flex w-6 ml-3 justify-center">{item.icon}</div>
              <motion.span
                animate={{
                  opacity: isOpen ? 1 : 0,
                  width: isOpen ? "auto" : 0,
                }}
                transition={{ duration: 0.25 }}
                className="ml-3 overflow-hidden whitespace-nowrap"
              >
                <p>{item.label}</p>
              </motion.span>
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}
