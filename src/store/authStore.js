import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => {
        console.log("AuthStore: setAuth called with", { token, user });
        set({ token, user });
        console.log("AuthStore: State after setAuth", { token, user });
      },
      logout: () => {
        console.log("AuthStore: logout called");
        set({ token: null, user: null });
      },
    }),
    {
      name: "bidzen-auth",   // persists to localStorage automatically
      onRehydrateStorage: () => (state) => {
        console.log("AuthStore: Rehydrating state", state);
      }
    }
  )
);
