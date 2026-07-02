import React from 'react';
import { Role } from '../../types';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { motion } from 'motion/react';

interface MantriRevealProps {
  myRole: Role | null;
  onReveal: () => void;
}

export const MantriReveal: React.FC<MantriRevealProps> = ({ myRole, onReveal }) => {
  if (myRole === Role.Mantri) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-8 bg-white tactile-card max-w-md mx-auto text-center z-20"
      >
        <h2 className="text-3xl heritage-heading font-black mb-2">You are the Mantri!</h2>
        <p className="text-[var(--color-heritage-indigo)] opacity-80 mb-8 font-bold text-sm uppercase tracking-widest">Reveal yourself to the Raja and find the Chor.</p>
        <Button 
          size="lg" 
          onClick={onReveal}
          className="w-full bg-[var(--color-heritage-green)] text-white hover:bg-opacity-90 shadow-[var(--shadow-tactile-md)]"
        >
          "Main Hoon!" (Reveal)
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full z-20">
      <LoadingSpinner size="lg" />
      <h3 className="mt-8 text-2xl heritage-heading font-black">Waiting for Mantri...</h3>
      <p className="text-[var(--color-heritage-indigo)] opacity-70 mt-2 font-bold uppercase tracking-widest text-sm">The Mantri is revealing themselves to the Raja.</p>
    </div>
  );
};
