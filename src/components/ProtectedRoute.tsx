"use client";

import api from "@/lib/axios";
import Spinner from "./ui/Spinner";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { token, setAuth, clearAuth, initialized, loadFromStorage } =
    useAuthStore();

  useEffect(() => {
    // Pastikan state diinit dari localStorage dulu
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    const checkAuth = async () => {
      if (!initialized) return; // tunggu init dulu

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const res = await api.get("/user/me");
        setAuth(token, res.data); // update user di store
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        clearAuth();
        router.replace("/login");
      }
    };

    checkAuth();
  }, [token, initialized, setAuth, clearAuth, router]);

  if (!initialized) {
    return (
      // Loading spinner centered when initializing
      <div className="flex items-center justify-center h-screen">
        <Spinner size={40} />
      </div>
    );
  }

  return <>{children}</>;
}
