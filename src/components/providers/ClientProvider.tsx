"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return <>{children}</>;
}
