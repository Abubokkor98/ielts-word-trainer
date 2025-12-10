import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  xp: number;
  streak: number;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      hasHydrated: false,
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),
      setToken: (token) =>
        set({
          accessToken: token,
        }),
      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        // Called after rehydration completes
        if (state) {
          state.hasHydrated = true;
        }
      },
    }
  )
);
