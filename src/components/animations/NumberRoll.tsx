import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface NumberRollProps {
  value: number;
  className?: string;
}

export const NumberRoll: React.FC<NumberRollProps> = ({ value, className }) => {
  const [prevValue, setPrevValue] = useState(value);

  useEffect(() => {
    if (value !== prevValue) {
      setPrevValue(value);
    }
  }, [value, prevValue]);

  return (
    <div className={`relative inline-flex overflow-hidden ${className || ''}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.4, type: 'spring', bounce: 0.3 }}
          className="inline-block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};
