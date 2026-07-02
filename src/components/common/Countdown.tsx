import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CountdownProps {
  seconds: number;
  onComplete?: () => void;
}

export const Countdown: React.FC<CountdownProps> = ({ seconds, onComplete }) => {
  const [timeLeft, setTimeLeft] = React.useState(seconds);

  React.useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  return (
    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-[var(--shadow-tactile-lg)] border-4 border-[var(--color-heritage-indigo)]">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={timeLeft}
          initial={{ scale: 0.5, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 1.5, opacity: 0, y: -20 }}
          transition={{ duration: 0.4, type: 'spring' }}
          className="text-7xl heritage-heading font-black text-[var(--color-heritage-indigo)] drop-shadow-sm"
        >
          {timeLeft}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};
