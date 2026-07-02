import React, { useState, useEffect } from 'react';
import { EMOJI_REACTIONS } from '../../constants';
import { useRoomStore } from '../../store/roomStore';
import { usePlayerStore } from '../../store/playerStore';
import { motion, AnimatePresence } from 'motion/react';

export const ReactionBar: React.FC = () => {
  const room = useRoomStore(state => state.room);
  const playerId = usePlayerStore(state => state.playerId);
  const [isOpen, setIsOpen] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  useEffect(() => {
    if (cooldown) {
      const timer = setTimeout(() => setCooldown(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleReaction = (emoji: string) => {
    if (!room || !playerId || cooldown) return;
    
    useRoomStore.getState().dispatchAction({ type: 'SEND_REACTION', emoji });
    setCooldown(true);
    setIsOpen(false); // Auto close on mobile, optionally keep open on desktop
  };

  if (!room || !playerId) return null;

  return (
    <div className="absolute bottom-6 right-6 z-30 hidden md:block">
      <div className="relative">
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-16 right-0 bg-black/60 backdrop-blur-md rounded-2xl p-2 flex flex-wrap w-48 gap-2 border border-white/20 shadow-2xl"
            >
              {EMOJI_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  disabled={cooldown}
                  className="w-10 h-10 flex items-center justify-center text-2xl hover:bg-white/20 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {emoji}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-2xl shadow-lg transition-colors"
        >
          {isOpen ? '💬' : '😀'}
        </button>
      </div>
    </div>
  );
};

// Component to render floating reactions on players
export const FloatingReactions = () => {
  const room = useRoomStore(state => state.room);
  const [activeReactions, setActiveReactions] = useState<any[]>([]);

  useEffect(() => {
    if (!room?.gameState.reactions) return;

    // Filter reactions from the last 3 seconds
    const now = Date.now();
    const recent = room.gameState.reactions.filter(r => now - r.timestamp < 3000);
    
    // Simple state update, could be optimized for rendering per player
    setActiveReactions(recent);
  }, [room?.gameState.reactions]);

  if (activeReactions.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <AnimatePresence>
        {activeReactions.map((r) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 50, scale: 0.5 }}
            animate={{ opacity: 1, y: -50, scale: 1.5 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            // We would position these absolutely relative to the player's avatar in a real implementation
            // For now, float them near the center/bottom
            className="absolute bottom-1/4 left-1/2 text-4xl"
            style={{ 
              marginLeft: `${(Math.random() - 0.5) * 200}px`,
            }}
          >
            {r.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
