import { create } from 'zustand';

import API from '@/lib/api';
import apiRoutes from '@/constants/apiRoutes';

export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at: Date;
  email_verified: boolean;
  role: string;
  picture?: string;
};

type State = {
  user: User | null;
  initialized: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setInitialized: (value: boolean) => void;
  logout: () => Promise<void>;
};

export const useUserStore = create<State>((set) => ({
  user: null,
  initialized: false,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  setInitialized: (value) => set({ initialized: value }),
  logout: async () => {
    try {
      await API.post(apiRoutes.auth.logout);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({ user: null, initialized: true });
    }
  },
}));

