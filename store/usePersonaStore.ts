import { create } from 'zustand';

interface PersonaState {
  user: { name: string; email: string };
  metrics: { 
    height: number; 
    weight: number; 
    shoulderType: string; 
    chestType: string; 
  };
  category: string | null;
  setUserInfo: (info: { name: string; email: string }) => void;
  setMetrics: (newMetrics: any) => void;
  setCategory: (cat: string) => void;
}

export const usePersonaStore = create<PersonaState>((set) => ({
  user: { name: '', email: '' },
  metrics: { height: 0, weight: 0, shoulderType: '', chestType: '' },
  category: null,
  setUserInfo: (user) => set({ user }),
  setMetrics: (newMetrics) => set((state) => ({ metrics: { ...state.metrics, ...newMetrics } })),
  setCategory: (cat) => set({ category: cat }),
}));