export enum Role {
  Raja = 'Raja',
  Mantri = 'Mantri',
  Chor = 'Chor',
  Sipahi = 'Sipahi',
}

export enum GamePhase {
  Landing = 'Landing',
  Lobby = 'Lobby',
  AssignRoles = 'AssignRoles',
  RoleReveal = 'RoleReveal',
  MantriReveal = 'MantriReveal',
  Guess = 'Guess',
  Result = 'Result',
  Leaderboard = 'Leaderboard',
  Winner = 'Winner',
  Replay = 'Replay',
}

export enum RoomStatus {
  Waiting = 'Waiting',
  Playing = 'Playing',
  Finished = 'Finished',
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  ready: boolean;
  connected: boolean;
  score: number;
  role: Role | null;
  lastSeen?: number; // timestamp
}

export interface GuessResult {
  guesserId: string;
  guessedId: string;
  correct: boolean;
}

export interface Reaction {
  playerId: string;
  emoji: string;
  timestamp: number;
  id: string;
}

export interface GameState {
  phase: GamePhase;
  guess: GuessResult | null;
  revealed: boolean;
  winner: string[] | null; // Array of player IDs in case of tie
  reactions: Reaction[];
}

export interface ChatMessage {
  id: string;
  playerId: string;
  text: string;
  timestamp: number;
}

export interface ActivityLogEntry {
  id: string;
  message: string;
  timestamp: number;
  type: 'system' | 'gameplay';
}

export interface Room {
  id: string;
  hostId: string;
  status: RoomStatus;
  currentRound: number;
  maxRounds: number;
  players: Record<string, Player>;
  gameState: GameState;
  chatMessages: ChatMessage[];
  activityLogs: ActivityLogEntry[];
  createdAt: number;
}
