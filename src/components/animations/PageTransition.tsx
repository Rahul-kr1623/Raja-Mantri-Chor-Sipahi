import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex min-h-screen w-full flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
