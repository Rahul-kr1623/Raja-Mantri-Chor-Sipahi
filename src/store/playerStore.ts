import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PlayerState {
  playerId: string | null;
  playerName: string;
  playerAvatar: string;
  setPlayer: (id: string, name: string, avatar: string) => void;
  clearPlayer: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      playerId: null,
      playerName: '',
      playerAvatar: '🐶', // default avatar
      setPlayer: (id, name, avatar) => set({ playerId: id, playerName: name, playerAvatar: avatar }),
      clearPlayer: () => set({ playerId: null, playerName: '', playerAvatar: '🐶' }),
    }),
    {
      name: 'rmcs-player-storage',
    }
  )
);
