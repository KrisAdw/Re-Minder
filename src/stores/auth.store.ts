import { create } from "zustand";

type User = {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  initialized: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  loadFromStorage: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  initialized: false,

  setAuth: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ token, user, initialized: true });
  },

  clearAuth: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null, initialized: true });
  },

  loadFromStorage: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user && user !== "undefined") {
      try {
        const parsed = JSON.parse(user) as User;
        set({ token, user: parsed, initialized: true });
      } catch (err) {
        console.error("❌ Failed to parse user from localStorage", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        set({ token: null, user: null, initialized: true });
      }
    } else {
      set({ initialized: true });
    }
  },
}));
