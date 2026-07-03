import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { PageTransition } from '../components/animations/PageTransition';
import { PlayerCard } from '../components/lobby/PlayerCard';
import { RoomCodeDisplay } from '../components/lobby/RoomCodeDisplay';
import { ReadyButton } from '../components/lobby/ReadyButton';
import { ChatBox } from '../components/gameplay/ChatBox';
import { Button } from '../components/common/Button';
import { useRoom } from '../hooks/useRoom';
import { usePresence } from '../hooks/usePresence';
import { useRoomStore } from '../store/roomStore';
import { usePlayerStore } from '../store/playerStore';
import { RoomStatus, Player } from '../types';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';
import { setOnKickedCallback } from '../services/multiplayer/peer';

export const Lobby: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  
  useRoom(roomId || null);
  usePresence(roomId || null);

  // If this client gets kicked, navigate them back to home
  useEffect(() => {
    setOnKickedCallback(() => navigate('/'));
    return () => setOnKickedCallback(() => {});
  }, [navigate]);

  const room = useRoomStore(state => state.room);
  const playerId = usePlayerStore(state => state.playerId);

  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (room?.status === RoomStatus.Playing) {
      navigate(`/game/${roomId}`);
    }
  }, [room?.status, navigate, roomId]);

  // Redirect to join page if state is lost (e.g. user refreshed the page)
  useEffect(() => {
    if (!room || !playerId) {
      if (roomId) {
        toast.error("You have been disconnected. Please rejoin.");
        navigate(`/join?code=${roomId}`);
      } else {
        navigate('/');
      }
    }
  }, [room, playerId, navigate, roomId]);

  if (!room || !playerId) {
    return <div className="flex flex-1 items-center justify-center text-[var(--color-heritage-indigo)] font-bold">Loading lobby...</div>;
  }

  const players = Object.values(room.players);
  const myPlayer = room.players[playerId];
  const isHost = room.hostId === playerId;

  // Create array of exactly 4 slots
  const playerSlots: (Player | null)[] = [...players];
  while (playerSlots.length < 4) {
    playerSlots.push(null);
  }

  const allReady = players.length === 4 && players.every(p => p.ready);

  const handleToggleReady = async () => {
    if (!roomId || !playerId || !myPlayer) return;
    try {
      useRoomStore.getState().dispatchAction({ type: 'SET_READY', ready: !myPlayer.ready });
    } catch (e) {
      toast.error('Failed to update ready state');
    }
  };

  const handleStartGame = async () => {
    if (!roomId || !isHost || !allReady) return;
    setStarting(true);
    try {
      useRoomStore.getState().dispatchAction({ type: 'START_GAME' });
    } catch (e) {
      toast.error('Failed to start game');
      setStarting(false);
    }
  };

  const handleKickPlayer = (targetId: string) => {
    if (!isHost) return;
    useRoomStore.getState().dispatchAction({ type: 'KICK_PLAYER', targetId });
    toast.success('Player kicked.');
  };

  return (
    <PageTransition>
      <div className="flex flex-1 flex-col items-center pt-8">
        <RoomCodeDisplay roomCode={room.id} />

        <div className="w-full max-w-5xl px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {playerSlots.map((player, index) => (
            <PlayerCard 
              key={player?.id || `empty-${index}`}
              player={player}
              isHost={player?.id === room.hostId}
              isMe={player?.id === playerId}
              canKick={isHost}
              onKick={handleKickPlayer}
            />
          ))}
        </div>

        <div className="flex flex-col items-center w-full max-w-sm px-4">
          <ReadyButton 
            isReady={myPlayer?.ready || false} 
            onToggle={handleToggleReady}
            disabled={starting}
          />

          {isHost && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="w-full mt-4"
            >
              <Button 
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleStartGame}
                disabled={!allReady || starting}
                isLoading={starting}
              >
                {allReady ? 'Start Game' : 'Waiting for everyone to be ready...'}
              </Button>
            </motion.div>
          )}
        </div>
        <ChatBox />
      </div>
    </PageTransition>
  );
};
