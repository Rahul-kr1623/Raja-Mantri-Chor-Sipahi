import React from 'react';
import { motion } from 'motion/react';

interface RoundIndicatorProps {
  current: number;
  total: number;
}

export const RoundIndicator: React.FC<RoundIndicatorProps> = ({ current, total }) => {
  const isUnlimited = total === 999;
  const progress = isUnlimited ? 100 : (current / total) * 100;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center justify-center z-30">
      <div className="bg-white px-4 py-2 rounded-sm shadow-[var(--shadow-tactile-sm)] tactile-border flex items-center gap-2">
        <span className="text-[var(--color-heritage-indigo)] opacity-80 font-bold uppercase tracking-widest text-xs sm:text-sm">
          Round
        </span>
        <span className="text-lg sm:text-xl heritage-heading font-black text-[var(--color-heritage-saffron)]">
          {current} {isUnlimited ? '' : `/ ${total}`}
        </span>
      </div>
    </div>
  );
};
