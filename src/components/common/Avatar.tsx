import React from 'react';
import clsx from 'clsx';
import { motion } from 'motion/react';

interface AvatarProps {
  emoji: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  emoji, 
  size = 'md', 
  isSelected = false, 
  onClick,
  className 
}) => {
  const sizes = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-24 h-24 text-5xl',
    xl: 'w-32 h-32 text-6xl',
  };

  const isClickable = !!onClick;

  return (
    <motion.div
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      className={`
        relative flex items-center justify-center rounded-full
        ${sizes[size]} 
        ${isSelected 
          ? 'bg-[var(--color-heritage-saffron)] tactile-border shadow-[var(--shadow-tactile-sm)]' 
          : 'bg-white tactile-border'
        }
        ${onClick ? 'cursor-pointer hover:bg-[var(--color-heritage-paper-dark)] shadow-[var(--shadow-tactile-sm)]' : ''}
        ${className}
      `}
    >
      {emoji}
    </motion.div>
  );
};
