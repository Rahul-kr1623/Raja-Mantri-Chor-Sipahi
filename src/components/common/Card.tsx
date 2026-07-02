import React from 'react';
import { motion } from 'motion/react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animate?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  animate = true,
  ...props 
}) => {
  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`tactile-card p-6 ${className}`}
        {...(props as any)}
      >
        {/* Decorative corner accents */}
        <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-[var(--color-heritage-gold)] opacity-50" />
        <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-[var(--color-heritage-gold)] opacity-50" />
        <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-[var(--color-heritage-gold)] opacity-50" />
        <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-[var(--color-heritage-gold)] opacity-50" />
        
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    );
  }

  return (
    <div className={`tactile-card p-6 relative ${className}`} {...props}>
      {children}
    </div>
  );
};
