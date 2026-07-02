import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { PageTransition } from '../components/animations/PageTransition';
import { RoleCard } from '../components/gameplay/RoleCard';
import { RajaAnnouncement } from '../components/gameplay/RajaAnnouncement';
import { MantriReveal } from '../components/gameplay/MantriReveal';
import { GuessCard } from '../components/gameplay/GuessCard';
import { RevealAnimation } from '../components/gameplay/RevealAnimation';
import { RoundIndicator } from '../components/gameplay/RoundIndicator';
import { ReactionBar, FloatingReactions } from '../components/gameplay/ReactionBar';
import { LeaderboardRow } from '../components/leaderboard/LeaderboardRow';
import { Countdown } from '../components/common/Countdown';
import { TablePlayer } from '../components/gameplay/TablePlayer';
import { ChatBox } from '../components/gameplay/ChatBox';
import { ActivityLog } from '../components/gameplay/ActivityLog';
import { useRoom } from '../hooks/useRoom';
import { usePresence } from '../hooks/usePresence';
import { useGamePhase } from '../hooks/useGamePhase';
import { GamePhase, RoomStatus } from '../types';
import { TIMING } from '../constants';
import { useGameStore } from '../store/gameStore';
import { useRoomStore } from '../store/roomStore';
import toast from 'react-hot-toast';

export const Game: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  
  useRoom(roomId || null);
  usePresence(roomId || null);
  
  const { phase, myRole, isHost, myPlayerInfo, room } = useGamePhase();
  const showRoleCard = useGameStore(state => state.showRoleCard);
  const setShowRoleCard = useGameStore(state => state.setShowRoleCard);
  
  const [showCountdown, setShowCountdown] = useState(false);

  // Redirect if game finished or waiting
  useEffect(() => {
    if (!room) return;
    if (room.status === RoomStatus.Waiting) navigate(`/lobby/${roomId}`);
    if (room.status === RoomStatus.Finished) navigate(`/winner/${roomId}`);
  }, [room?.status, navigate, roomId]);

  // Host auto-progressions
  useEffect(() => {
    if (!isHost || !roomId || !room) return;
    const dispatch = useRoomStore.getState().dispatchAction;

    const runHostTasks = async () => {
      // 1. Assign roles
      if (phase === GamePhase.AssignRoles) {
        dispatch({ type: 'ASSIGN_ROLES' });
        setShowRoleCard(true); // Ensure local state resets
      }
      // 2. Result -> Leaderboard
      if (phase === GamePhase.Result) {
        setTimeout(async () => {
          dispatch({ type: 'PROCEED_LEADERBOARD' });
        }, TIMING.RESULT_REVEAL_DURATION);
      }
      // 3. Leaderboard -> Next Round
      if (phase === GamePhase.Leaderboard) {
        setTimeout(async () => {
          setShowCountdown(true); // Show local countdown visually
        }, 5000); // Show leaderboard for 5s
      }
    };

    runHostTasks();
  }, [phase, isHost, roomId, room, setShowRoleCard]);

  // When all players dismiss role card, advance phase
  useEffect(() => {
    if (isHost && phase === GamePhase.RoleReveal && roomId) {
      const timer = setTimeout(() => {
        useRoomStore.getState().dispatchAction({ type: 'PROCEED_RAJA' });
      }, TIMING.ROLE_REVEAL_DURATION + 2000); // 5s total
      return () => clearTimeout(timer);
    }
  }, [phase, isHost, roomId]);

  // Redirect to join page if state is lost (e.g. user refreshed the page)
  useEffect(() => {
    if (!room || !myPlayerInfo) {
      if (roomId) {
        toast.error("You have been disconnected from the game.");
        navigate(`/join?code=${roomId}`);
      } else {
        navigate('/');
      }
    }
  }, [room, myPlayerInfo, navigate, roomId]);

  // Manage Raja Announcement visibility
  const [showRajaAnnouncement, setShowRajaAnnouncement] = useState(false);

  useEffect(() => {
    if (phase === GamePhase.MantriReveal) {
      setShowRajaAnnouncement(true);
    } else {
      setShowRajaAnnouncement(false);
    }
  }, [phase]);

  const handleCountdownComplete = async () => {
    setShowCountdown(false);
    if (isHost && roomId) {
      useRoomStore.getState().dispatchAction({ type: 'NEXT_ROUND' });
    }
  };

  if (!room || !myPlayerInfo) return null;

  const renderPhase = () => {
    switch (phase) {
      case GamePhase.RoleReveal:
      case GamePhase.AssignRoles:
        return (
          <div className="flex h-full items-center justify-center z-20">
            <h2 className="text-3xl font-black heritage-heading text-[var(--color-heritage-indigo)] animate-pulse">Assigning Roles...</h2>
          </div>
        );
      
      case GamePhase.MantriReveal:
        return (
          <MantriReveal 
            myRole={myRole} 
            onReveal={() => roomId && useRoomStore.getState().dispatchAction({ type: 'REVEAL_MANTRI' })} 
          />
        );

      case GamePhase.Guess:
        return (
          <GuessCard 
            players={room.players} 
            myRole={myRole} 
            onGuess={(guessedId) => roomId && useRoomStore.getState().dispatchAction({ type: 'SUBMIT_GUESS', guessedId })} 
          />
        );

      case GamePhase.Result:
        return (
          <RevealAnimation 
            players={room.players} 
            guess={room.gameState.guess} 
            myId={myPlayerInfo.id} 
          />
        );

      case GamePhase.Leaderboard:
        if (showCountdown) {
          return (
            <div className="flex flex-col h-full items-center justify-center z-20">
              <h2 className="text-3xl text-[var(--color-heritage-indigo)] font-black heritage-heading mb-8">Next round starts in...</h2>
              <Countdown seconds={3} onComplete={handleCountdownComplete} />
            </div>
          );
        }
        
        // Sort players by score
        const sortedPlayers = Object.values(room.players).sort((a, b) => b.score - a.score);
        
        return (
          <div className="w-full max-w-2xl mx-auto flex flex-col z-20">
            <h2 className="text-4xl heritage-heading font-black text-center text-[var(--color-heritage-indigo)] mb-8">Leaderboard</h2>
            {sortedPlayers.map((p, index) => {
              // Calculate points earned this round
              let pointsEarned = 0;
              if (room.gameState.guess) {
                 // In a real app we'd track previous scores or calculate based on the guess object
                 // To keep it simple visually we just rely on total score
                 // But we can infer if they got points this round based on role and guess
                 // For now, we skip pointsEarned calculation in LeaderboardRow
              }
              return (
                <LeaderboardRow 
                  key={p.id}
                  player={p}
                  position={index + 1}
                  previousPosition={index + 1} // We don't have historical rank tracking yet
                  pointsEarned={0} 
                  isMe={p.id === myPlayerInfo.id}
                />
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  // Map players to positions (self is always bottom)
  const otherPlayers = Object.values(room.players).filter(p => p.id !== myPlayerInfo.id);
  const topPlayer = otherPlayers.length > 0 ? otherPlayers[0] : null;
  const leftPlayer = otherPlayers.length > 1 ? otherPlayers[1] : null;
  const rightPlayer = otherPlayers.length > 2 ? otherPlayers[2] : null;

  return (
    <PageTransition>
      <div className="flex flex-1 flex-col relative w-full h-full min-h-[70vh]">
        <RoundIndicator current={room.currentRound} total={room.maxRounds} />
        
        {/* The Tabletop */}
        <div className="absolute inset-0 m-2 sm:m-4 md:m-8 lg:m-16 rounded-xl md:rounded-3xl border-4 border-[var(--color-heritage-indigo)] bg-[var(--color-heritage-paper-dark)] opacity-30 pointer-events-none shadow-[inset_var(--shadow-tactile-lg)]">
          {/* Subtle table pattern can go here */}
        </div>

        {/* Players */}
        <TablePlayer player={myPlayerInfo} position="bottom" isMe={true} />
        <TablePlayer player={topPlayer} position="top" isMe={false} />
        <TablePlayer player={leftPlayer} position="left" isMe={false} />
        <TablePlayer player={rightPlayer} position="right" isMe={false} />

        {/* Central Play Area */}
        <div className="flex-1 flex flex-col items-center justify-center mt-8 z-10 w-full relative">
          {renderPhase()}
        </div>

        <FloatingReactions />
        {phase !== GamePhase.RoleReveal && phase !== GamePhase.AssignRoles && <ReactionBar />}

        <ActivityLog />
        <ChatBox />
      </div>

      <RoleCard 
        role={myRole} 
        isVisible={phase === GamePhase.RoleReveal && showRoleCard} 
        onUnderstand={() => setShowRoleCard(false)} 
      />

      <RajaAnnouncement 
        isVisible={showRajaAnnouncement} 
        myRole={myRole} 
        onComplete={() => setShowRajaAnnouncement(false)} 
      />
    </PageTransition>
  );
};
