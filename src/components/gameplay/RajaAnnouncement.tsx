import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Role } from '../../types';
import { useSound } from '../../hooks/useSound';

interface RajaAnnouncementProps {
  isVisible: boolean;
  myRole: Role | null;
  onComplete: () => void;
}

export const RajaAnnouncement: React.FC<RajaAnnouncementProps> = ({ isVisible, myRole, onComplete }) => {
  const { play } = useSound();
  
  useEffect(() => {
    if (isVisible) {
      play('win'); // majestic sound
      const timer = setTimeout(() => {
        onComplete();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete, play]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-heritage-paper)]/90 backdrop-blur-sm p-4"
        >
          {myRole === Role.Raja ? (
            <motion.div
              initial={{ scale: 0.5, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="text-center p-8 bg-white tactile-card max-w-lg w-full"
            >
              <h2 className="text-sm font-bold text-[var(--color-heritage-indigo)] opacity-80 uppercase tracking-widest mb-4">You ask:</h2>
              <h1 className="text-4xl md:text-6xl heritage-heading font-black text-[var(--color-heritage-saffron)]">
                "Mera Mantri<br/>Kaun Hai?"
              </h1>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.5, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="text-center p-8 bg-white tactile-card max-w-lg w-full"
            >
              <h2 className="text-sm font-bold text-[var(--color-heritage-indigo)] opacity-80 uppercase tracking-widest mb-4">The Raja asks:</h2>
              <h1 className="text-3xl md:text-5xl heritage-heading font-black text-[var(--color-heritage-saffron)]">
                "Mera Mantri Kaun Hai?"
              </h1>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
