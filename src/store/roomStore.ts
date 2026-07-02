import { create } from 'zustand';
import type { Room, Player } from '../types';
import { GamePhase, RoomStatus } from '../types';
import { multiplayer } from '../services/multiplayer/peer';

interface RoomState {
  room: Room | null;
  roomCode: string | null;
  
  // Basic updates (from P2P)
  setRoomCode: (code: string | null) => void;
  updateFromSnapshot: (roomData: Room | null) => void;
  clearRoom: () => void;
  
  // Host-only direct mutations (will trigger broadcast)
  initRoom: (roomId: string, hostId: string, maxRounds: number, hostPlayer: Player) => void;
  updateRoom: (partial: Partial<Room>) => void;
  updatePlayer: (playerId: string, partial: Partial<Player>) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;

  // Actions that any client can dispatch (sent via WebRTC)
  dispatchAction: (action: any) => void;
}

export const useRoomStore = create<RoomState>((set, get) => ({
  room: null,
  roomCode: null,
  
  setRoomCode: (code) => set({ roomCode: code }),
  
  updateFromSnapshot: (roomData) => set({ room: roomData }),
  
  clearRoom: () => {
    multiplayer.disconnect();
    set({ room: null, roomCode: null });
  },

  // --- HOST ONLY MUTATIONS ---
  initRoom: (roomId, hostId, maxRounds, hostPlayer) => {
    const newRoom: Room = {
      id: roomId,
      hostId: hostId,
      status: RoomStatus.Waiting,
      currentRound: 1,
      maxRounds: maxRounds,
      players: {
        [hostId]: hostPlayer,
      },
      gameState: {
        phase: GamePhase.Lobby,
        guess: null,
        revealed: false,
        winner: null,
        reactions: []
      },
      chatMessages: [],
      activityLogs: [],
      createdAt: Date.now()
    };
    set({ room: newRoom });
    multiplayer.broadcastState(newRoom);
  },

  updateRoom: (partial) => {
    const state = get();
    if (!state.room) return;
    const newRoom = { ...state.room, ...partial };
    set({ room: newRoom });
    multiplayer.broadcastState(newRoom);
  },

  updatePlayer: (playerId, partial) => {
    const state = get();
    if (!state.room || !state.room.players[playerId]) return;
    const newPlayers = { ...state.room.players };
    newPlayers[playerId] = { ...newPlayers[playerId], ...partial };
    
    const newRoom = { ...state.room, players: newPlayers };
    set({ room: newRoom });
    multiplayer.broadcastState(newRoom);
  },

  addPlayer: (player) => {
    const state = get();
    if (!state.room) return;
    const newPlayers = { ...state.room.players, [player.id]: player };
    
    const newRoom = { ...state.room, players: newPlayers };
    set({ room: newRoom });
    multiplayer.broadcastState(newRoom);
  },

  removePlayer: (playerId) => {
    const state = get();
    if (!state.room) return;
    const newPlayers = { ...state.room.players };
    
    if (state.room.status === RoomStatus.Waiting) {
      delete newPlayers[playerId];
    } else {
      newPlayers[playerId].connected = false;
    }
    
    const newRoom = { ...state.room, players: newPlayers };
    set({ room: newRoom });
    multiplayer.broadcastState(newRoom);
  },

  // --- CLIENT DISPATCH ---
  dispatchAction: (action) => {
    multiplayer.sendAction(action);
  }
}));
