import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  isDarkMode: boolean;
  isSoundMuted: boolean;
  toggleDarkMode: () => void;
  toggleSound: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      isDarkMode: true, // Default to true based on aesthetics 
      isSoundMuted: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      toggleSound: () => set((state) => ({ isSoundMuted: !state.isSoundMuted })),
    }),
    {
      name: 'rmcs-settings-storage',
    }
  )
);
