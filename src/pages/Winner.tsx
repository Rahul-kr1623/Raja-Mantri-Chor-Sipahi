import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { PageTransition } from '../components/animations/PageTransition';
import { WinnerPodium } from '../components/leaderboard/WinnerPodium';
import { ScoreCard } from '../components/leaderboard/ScoreCard';
import { ConfettiEffect, ConfettiHandle } from '../components/animations/ConfettiEffect';
import { Button } from '../components/common/Button';
import { useRoom } from '../hooks/useRoom';
import { useRoomStore } from '../store/roomStore';
import { usePlayerStore } from '../store/playerStore';

export const Winner: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  useRoom(roomId || null);
  
  const room = useRoomStore(state => state.room);
  const playerId = usePlayerStore(state => state.playerId);
  
  const confettiRef = useRef<ConfettiHandle>(null);

  useEffect(() => {
    if (room && confettiRef.current) {
      confettiRef.current.fireworks();
    }
  }, [room]);

  if (!room || !playerId) return null;

  const isHost = room.hostId === playerId;
  const sortedPlayers = Object.values(room.players).sort((a, b) => b.score - a.score);

  const handlePlayAgain = async () => {
    if (roomId && isHost) {
      useRoomStore.getState().dispatchAction({ type: 'PLAY_AGAIN' });
      navigate(`/lobby/${roomId}`);
    }
  };

  const handleExit = () => {
    navigate('/');
  };

  return (
    <PageTransition>
      <div className="flex flex-1 flex-col items-center">
        <ConfettiEffect ref={confettiRef} />
        
        <div className="text-center mt-4">
          <h1 className="text-6xl md:text-8xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]">
            Game Over!
          </h1>
        </div>

        <WinnerPodium winners={sortedPlayers} myId={playerId} />

        <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 px-4 mt-8">
          {sortedPlayers.map(p => (
            <ScoreCard key={p.id} player={p} />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-12 mb-8 z-20">
          {isHost ? (
            <Button size="lg" onClick={handlePlayAgain} className="min-w-[200px]">
              Play Again
            </Button>
          ) : (
            <div className="text-white/70 italic mb-4 sm:mb-0">Waiting for host to play again...</div>
          )}
          <Button size="lg" variant="ghost" onClick={handleExit} className="min-w-[200px]">
            Exit Room
          </Button>
        </div>
      </div>
    </PageTransition>
  );
};
