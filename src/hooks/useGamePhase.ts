import { useRoomStore } from '../store/roomStore';
import { usePlayerStore } from '../store/playerStore';
import { GamePhase, Role } from '../types';

export const useGamePhase = () => {
  const room = useRoomStore((state) => state.room);
  const playerId = usePlayerStore((state) => state.playerId);

  if (!room || !playerId) {
    return {
      phase: GamePhase.Landing,
      myRole: null,
      isHost: false,
      myPlayerInfo: null,
    };
  }

  const myPlayerInfo = room.players[playerId];
  const isHost = room.hostId === playerId;
  const phase = room.gameState.phase;
  const myRole = myPlayerInfo?.role || null;

  return {
    phase,
    myRole,
    isHost,
    myPlayerInfo,
    room,
  };
};
