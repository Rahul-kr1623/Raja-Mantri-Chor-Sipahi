import { useEffect } from 'react';
import { useRoomStore } from '../store/roomStore';

export const useRoom = (roomCode: string | null) => {
  const clearRoom = useRoomStore((state) => state.clearRoom);

  useEffect(() => {
    // With WebRTC, connection is established on Join/Create.
    // If the component unmounts and we want to clean up, we can do it here,
    // but typically we only disconnect if they explicitly leave.
    
    return () => {
      // In a real app we might disconnect on unmount, but for a SPA game 
      // we only want to disconnect on explicit exit or window close.
    };
  }, [roomCode, clearRoom]);
};
