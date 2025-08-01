import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { authService } from '@/api/services/authService';
import type { MenuNode, UserProfile } from '@/types/api-contract';

interface AuthState {
  accessToken: string | null;
  user: UserProfile | null;
  menus: MenuNode[] | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (data: { accessToken: string; user: UserProfile }) => void;
  logout: () => void;
  refreshTokens: (accessToken: string) => void;
  setProfile: (user: UserProfile) => void;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  menus: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    immer((set) => ({
      ...initialState,

      login: ({ accessToken, user }) => {
        set((state) => {
          state.accessToken = accessToken;
          state.user = user;
          state.menus = user.menus;
          state.isAuthenticated = true;
        });
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout API call failed, but clearing client state anyway.', error);
        } finally {
          set(() => initialState);
        }
      },

      refreshTokens: (accessToken) => {
        set((state) => {
          state.accessToken = accessToken;
        });
      },

      setProfile: (user) => {
        set((state) => {
          state.user = user;
          state.menus = user.menus;
        });
      },
    })),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        menus: state.menus,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
