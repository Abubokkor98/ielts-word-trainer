import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  xp: number;
  streak: number;
  lastQuizDate?: string;
  profilePictureUrl?: string | null;
  profilePictureId?: string | null;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  hasHydrated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

// Selector to compute isAuthenticated from user state
export const selectIsAuthenticated = (state: AuthState) => !!state.user;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      hasHydrated: false,
      setUser: (user) =>
        set({
          user,
        }),
      setToken: (token) =>
        set({
          accessToken: token,
        }),
      logout: () =>
        set({
          user: null,
          accessToken: null,
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

// Convenience hook to get isAuthenticated
export const useIsAuthenticated = () => useAuthStore(selectIsAuthenticated);

// Convenience hook to check if user is a viewer (demo account)
export const useIsViewer = () => {
  const user = useAuthStore((state) => state.user);
  return user?.role === 'viewer';
};
