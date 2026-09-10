import { create } from 'zustand';
import { User } from '../services/api';

interface AppState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
}

const savedToken = localStorage.getItem('enem_quest_token');

export const useAppStore = create<AppState>((set) => ({
  user: null,
  token: savedToken,
  isLoading: !!savedToken,

  setAuth: (user, token) => {
    localStorage.setItem('enem_quest_token', token);
    set({ user, token, isLoading: false });
  },

  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),

  logout: () => {
    localStorage.removeItem('enem_quest_token');
    set({ user: null, token: null, isLoading: false });
  },
}));
