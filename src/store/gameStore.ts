import { create } from 'zustand';

// Store purely for frontend animation and local phase states if needed. 
// Most game state comes from Firestore via roomStore.
interface GameStateLocal {
  showRoleCard: boolean;
  setShowRoleCard: (show: boolean) => void;
}

export const useGameStore = create<GameStateLocal>((set) => ({
  showRoleCard: true,
  setShowRoleCard: (show) => set({ showRoleCard: show }),
}));
