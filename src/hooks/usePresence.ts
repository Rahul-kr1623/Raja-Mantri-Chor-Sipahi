import { useEffect } from 'react';
import { multiplayer } from '../services/multiplayer/peer';
import { useRoomStore } from '../store/roomStore';

export const usePresence = (roomCode: string | null) => {
  useEffect(() => {
    const handleBeforeUnload = () => {
      multiplayer.disconnect();
      useRoomStore.getState().clearRoom();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [roomCode]);
};
