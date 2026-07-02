import React, { useEffect } from 'react';
import { Player } from '../../types';
import { Avatar } from '../common/Avatar';
import { motion } from 'motion/react';
import { Crown } from 'lucide-react';
import { NumberRoll } from '../animations/NumberRoll';
import { useSound } from '../../hooks/useSound';

interface WinnerPodiumProps {
  winners: Player[]; // Sorted by score descending
  myId: string;
}

export const WinnerPodium: React.FC<WinnerPodiumProps> = ({ winners, myId }) => {
  const { play } = useSound();
  
  useEffect(() => {
    play('win');
  }, [play]);

  // Handle ties logic: rank them 1, 2, 3 but if tied they might share a rank.
  // For simplicity, we just display top 3 array items in 2, 1, 3 order visually.
  
  const first = winners[0];
  const second = winners.length > 1 ? winners[1] : null;
  const third = winners.length > 2 ? winners[2] : null;

  const renderPodium = (player: Player | null, rank: 1 | 2 | 3) => {
    if (!player) return <div className="w-1/3" />;
    
    const heights = { 1: 'h-48', 2: 'h-36', 3: 'h-24' };
    const colors = {
      1: 'from-yellow-400 to-yellow-600 border-yellow-300 shadow-[0_0_30px_rgba(250,204,21,0.5)]',
      2: 'from-slate-300 to-slate-500 border-slate-200 shadow-[0_0_20px_rgba(203,213,225,0.4)]',
      3: 'from-orange-600 to-orange-800 border-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.4)]',
    };
    
    const isMe = player.id === myId;

    return (
      <div className="flex flex-col items-center w-1/3 px-2 z-10">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: rank === 1 ? 1 : rank === 2 ? 0.5 : 0, type: 'spring', bounce: 0.4 }}
          className="flex flex-col items-center relative mb-4"
        >
          {rank === 1 && (
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.5, type: 'spring' }}
              className="absolute -top-12 z-20 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,1)]"
            >
              <Crown size={48} fill="currentColor" />
            </motion.div>
          )}
          
          <Avatar emoji={player.avatar} size="lg" className={`z-10 bg-black/50 backdrop-blur-md border-4 ${rank === 1 ? 'border-yellow-400' : rank === 2 ? 'border-slate-300' : 'border-orange-500'}`} />
          <h3 className="font-bold text-lg text-white mt-2 truncate w-full text-center px-1">{player.name}</h3>
          {isMe && <span className="text-xs text-white/50">(You)</span>}
          <div className="text-xl font-display font-bold text-white mt-1">
            <NumberRoll value={player.score} />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          transition={{ delay: rank === 1 ? 1 : rank === 2 ? 0.5 : 0, duration: 0.5 }}
          className={`w-full ${heights[rank]} rounded-t-lg bg-gradient-to-b ${colors[rank]} border-t-4 border-l-2 border-r-2 flex justify-center pt-4 relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds.png')] opacity-30 mix-blend-overlay" />
          <span className="text-5xl font-display font-bold text-black/30 mix-blend-multiply drop-shadow-sm">{rank}</span>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="flex items-end justify-center w-full max-w-2xl mx-auto h-80 mt-16 mb-8 border-b-4 border-white/20 pb-0">
      {renderPodium(second, 2)}
      {renderPodium(first, 1)}
      {renderPodium(third, 3)}
    </div>
  );
};
