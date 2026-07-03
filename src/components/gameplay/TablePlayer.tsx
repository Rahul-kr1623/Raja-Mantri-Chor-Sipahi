import React from 'react';
import { Player } from '../../types';
import { Avatar } from '../common/Avatar';
import { motion } from 'motion/react';

interface TablePlayerProps {
  player: Player | null;
  position: 'top' | 'bottom' | 'left' | 'right';
  isMe: boolean;
}

export const TablePlayer: React.FC<TablePlayerProps> = ({ player, position, isMe }) => {
  if (!player) return null;

  const getPositionClasses = () => {
    switch (position) {
      case 'top': 
        return 'flex-col -translate-y-2 md:-translate-y-4';
      case 'bottom': 
        return 'flex-col translate-y-2 md:translate-y-4';
      case 'left': 
        return 'flex-col md:flex-row md:-translate-x-4';
      case 'right': 
        return 'flex-col md:flex-row-reverse md:translate-x-4';
    }
  };

  const getAbsoluteClasses = () => {
    switch (position) {
      case 'top': return 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto';
      case 'bottom': return 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-auto';
      case 'left': return 'top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 pointer-events-auto';
      case 'right': return 'top-1/2 right-0 -translate-y-1/2 translate-x-1/2 pointer-events-auto';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`absolute ${getAbsoluteClasses()} flex items-center justify-center`}
    >
      <div className={`flex items-center gap-1 md:gap-2 ${getPositionClasses()}`}>
        <Avatar 
          emoji={player.avatar} 
          size="sm" 
          className={`shadow-[var(--shadow-tactile-md)] md:w-16 md:h-16 md:text-3xl ${isMe ? 'border-2 md:border-4 border-[var(--color-heritage-saffron)]' : ''}`} 
        />
        <div className={`flex flex-col ${
          position === 'left' ? 'items-center md:items-start' : 
          position === 'right' ? 'items-center md:items-end' : 
          'items-center'
        }`}>
          <span className="font-bold text-sm text-[var(--color-heritage-indigo)] bg-white px-2 py-0.5 rounded-sm tactile-border">
            {player.name} {isMe && '(You)'}
          </span>
          <span className="text-xs font-bold text-[var(--color-heritage-saffron)] mt-1">
            Score: {player.score}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
