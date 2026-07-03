import React, { useState } from 'react';
import { Player } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { Check, UserX } from 'lucide-react';

interface PlayerCardProps {
  player: Player | null;
  isHost: boolean;
  isMe: boolean;
  /** True when the VIEWER (current user) is the host of the room */
  canKick?: boolean;
  /** Called with the target player's id when the host clicks Kick */
  onKick?: (playerId: string) => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isHost,
  isMe,
  canKick = false,
  onKick,
}) => {
  const [confirmKick, setConfirmKick] = useState(false);

  if (!player) {
    return (
      <div className="relative flex aspect-[3/4] flex-col items-center justify-center rounded-sm border-2 border-dashed border-[var(--color-heritage-indigo)] opacity-50 bg-[var(--color-heritage-paper-dark)] p-4 text-[var(--color-heritage-indigo)]">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-4 text-4xl"
        >
          WAITING
        </motion.div>
        <div className="text-sm font-bold uppercase tracking-widest">Empty Slot</div>
      </div>
    );
  }

  // Host can kick anyone who is not themselves
  const showKickBtn = canKick && !isMe;

  const handleKickClick = () => {
    if (!confirmKick) {
      // First click – ask for confirmation
      setConfirmKick(true);
      // Auto-reset confirmation after 3 s if user changes their mind
      setTimeout(() => setConfirmKick(false), 3000);
    } else {
      // Second click – confirmed, fire the callback
      setConfirmKick(false);
      onKick?.(player.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative flex aspect-[3/4] flex-col items-center justify-between p-6 tactile-card ${
        player.ready ? 'bg-[#F2F9F5] border-[var(--color-heritage-green)]' : 'bg-white'
      } ${isMe ? 'shadow-[var(--shadow-tactile-lg)]' : ''}`}
    >
      {/* Top Badges */}
      <div className="flex w-full items-start justify-between">
        <div>
          {isHost && (
            <Badge variant="host">HOST</Badge>
          )}
        </div>
        
        {/* Connection status */}
        <div className="flex items-center space-x-1 rounded-sm bg-[var(--color-heritage-paper-dark)] border border-[var(--color-heritage-indigo)] px-2 py-1">
          <div className={`h-2 w-2 rounded-full ${player.connected ? 'bg-[var(--color-heritage-green)]' : 'bg-red-500 animate-pulse'}`} />
          <span className="text-[10px] uppercase font-bold text-[var(--color-heritage-indigo)]">
            {player.connected ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Avatar & Name */}
      <div className="flex flex-col items-center justify-center flex-1">
        <Avatar emoji={player.avatar} size="lg" className="mb-4" />
        <h3 className="text-xl font-bold text-[var(--color-heritage-indigo)] tracking-wide text-center truncate w-full px-2">
          {player.name}
        </h3>
        {isMe && <span className="text-xs text-[var(--color-heritage-saffron)] mt-1 font-bold">(You)</span>}
      </div>

      {/* Ready Status */}
      <div className="w-full h-10 flex items-center justify-center rounded-sm bg-[var(--color-heritage-paper-dark)] border border-[var(--color-heritage-indigo)] mt-4">
        <AnimatePresence mode="wait">
          {player.ready ? (
            <motion.div
              key="ready"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="flex items-center text-[var(--color-heritage-green)] font-bold tracking-wider uppercase text-sm"
            >
              <Check size={16} className="mr-1" /> Ready
            </motion.div>
          ) : (
            <motion.div
              key="not-ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[var(--color-heritage-indigo)] opacity-60 text-sm tracking-wider font-bold uppercase"
            >
              Not Ready
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Kick Button (host only, not on own card) */}
      <AnimatePresence>
        {showKickBtn && (
          <motion.button
            key="kick-btn"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            onClick={handleKickClick}
            title={confirmKick ? 'Click again to confirm kick' : `Kick ${player.name}`}
            className={`mt-3 w-full flex items-center justify-center gap-1.5 rounded-sm border px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              confirmKick
                ? 'border-red-500 bg-red-50 text-red-600 animate-pulse'
                : 'border-[var(--color-heritage-indigo)] bg-[var(--color-heritage-paper-dark)] text-[var(--color-heritage-indigo)] hover:border-red-400 hover:bg-red-50 hover:text-red-500'
            }`}
          >
            <UserX size={13} />
            {confirmKick ? 'Confirm Kick?' : 'Kick'}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
