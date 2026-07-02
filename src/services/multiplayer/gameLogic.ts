import { useRoomStore } from '../../store/roomStore';
import { GamePhase, RoomStatus, Role, GuessResult, Reaction } from '../../types';
import { shuffle } from '../../utils/shuffle';
import { SCORING } from '../../constants';
import { multiplayer } from './peer';

// This file only runs logic on the HOST. 
// Clients send actions here via WebRTC.

export const handleClientAction = (action: any) => {
  const store = useRoomStore.getState();
  const room = store.room;
  if (!room) return;

  const { playerId, type } = action;

  switch (type) {
    case 'SET_READY':
      store.updatePlayer(playerId, { ready: action.ready });
      break;

    case 'START_GAME':
      store.updateRoom({
        status: RoomStatus.Playing,
        gameState: { ...room.gameState, phase: GamePhase.AssignRoles }
      });
      break;

    case 'ASSIGN_ROLES':
      const roles = shuffle([Role.Raja, Role.Mantri, Role.Chor, Role.Sipahi]);
      const playerIds = Object.keys(room.players);
      
      const updatedPlayers = { ...room.players };
      playerIds.forEach((id, index) => {
        updatedPlayers[id] = { ...updatedPlayers[id], role: roles[index] };
      });

      store.updateRoom({
        players: updatedPlayers,
        gameState: { ...room.gameState, phase: GamePhase.RoleReveal, guess: null, revealed: false }
      });
      break;

    case 'PROCEED_RAJA':
      store.updateRoom({
        gameState: { ...room.gameState, phase: GamePhase.MantriReveal }
      });
      break;

    case 'REVEAL_MANTRI':
      store.updateRoom({
        gameState: { ...room.gameState, phase: GamePhase.Guess }
      });
      break;

    case 'SUBMIT_GUESS':
      const guessedPlayer = room.players[action.guessedId];
      const isCorrect = guessedPlayer.role === Role.Chor;
      
      const guess: GuessResult = {
        guesserId: playerId,
        guessedId: action.guessedId,
        correct: isCorrect
      };

      const scoredPlayers = { ...room.players };
      Object.values(scoredPlayers).forEach(p => {
        if (!p.role) return;
        const points = isCorrect ? SCORING[p.role].correct : SCORING[p.role].wrong;
        scoredPlayers[p.id] = { ...p, score: (p.score || 0) + points };
      });

      const guessLog = {
        id: Date.now().toString(),
        message: `Mantri guessed that ${guessedPlayer.name} is the Chor. They were ${isCorrect ? 'Correct (+800)!' : 'Wrong (0 pts)'}`,
        timestamp: Date.now(),
        type: 'gameplay' as const
      };

      store.updateRoom({
        players: scoredPlayers,
        gameState: { ...room.gameState, guess, phase: GamePhase.Result, revealed: true },
        activityLogs: [...(room.activityLogs || []), guessLog].slice(-50)
      });
      break;

    case 'PROCEED_LEADERBOARD':
      store.updateRoom({
        gameState: { ...room.gameState, phase: GamePhase.Leaderboard }
      });
      break;

    case 'NEXT_ROUND':
      if (room.currentRound >= room.maxRounds && room.maxRounds !== 999) {
        store.updateRoom({
          status: RoomStatus.Finished,
          gameState: { ...room.gameState, phase: GamePhase.Winner }
        });
      } else {
        store.updateRoom({
          currentRound: room.currentRound + 1,
          gameState: { ...room.gameState, phase: GamePhase.AssignRoles }
        });
      }
      break;

    case 'PLAY_AGAIN':
      const resetPlayers = { ...room.players };
      Object.keys(resetPlayers).forEach(id => {
        resetPlayers[id] = { ...resetPlayers[id], score: 0, ready: false, role: null };
      });

      store.updateRoom({
        currentRound: 1,
        status: RoomStatus.Waiting,
        players: resetPlayers,
        chatMessages: [],
        activityLogs: [],
        gameState: { phase: GamePhase.Lobby, guess: null, revealed: false, winner: null, reactions: [] }
      });
      break;

    case 'SEND_REACTION':
      const reaction: Reaction = {
        id: Date.now().toString() + Math.random().toString(36).substring(7),
        playerId,
        emoji: action.emoji,
        timestamp: Date.now()
      };
      
      const recentReactions = (room.gameState.reactions || []).filter(r => Date.now() - r.timestamp < 5000);
      
      store.updateRoom({
        gameState: { ...room.gameState, reactions: [...recentReactions, reaction] }
      });
      break;

    case 'SEND_CHAT':
      const newChat = {
        id: Date.now().toString() + Math.random().toString(36).substring(7),
        playerId,
        text: action.text,
        timestamp: Date.now()
      };
      const chats = [...(room.chatMessages || []), newChat];
      store.updateRoom({ chatMessages: chats.slice(-50) }); // Keep last 50
      break;

    case 'ADD_LOG':
      const newLog = {
        id: Date.now().toString() + Math.random().toString(36).substring(7),
        message: action.message,
        timestamp: Date.now(),
        type: action.logType || 'system'
      };
      const logs = [...(room.activityLogs || []), newLog];
      store.updateRoom({ activityLogs: logs.slice(-50) });
      break;
  }
};
