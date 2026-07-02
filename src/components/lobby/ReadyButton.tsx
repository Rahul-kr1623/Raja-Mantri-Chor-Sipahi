import React from 'react';
import { Button } from '../common/Button';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X } from 'lucide-react';

interface ReadyButtonProps {
  isReady: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const ReadyButton: React.FC<ReadyButtonProps> = ({ isReady, onToggle, disabled }) => {
  return (
    <Button
      variant={isReady ? 'danger' : 'primary'}
      size="lg"
      className="w-full max-w-sm relative overflow-hidden"
      onClick={onToggle}
      disabled={disabled}
    >
      <AnimatePresence mode="wait">
        {isReady ? (
          <motion.div
            key="cancel"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="flex items-center justify-center"
          >
            <X size={20} className="mr-2" /> Cancel Ready
          </motion.div>
        ) : (
          <motion.div
            key="ready"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="flex items-center justify-center"
          >
            <Check size={20} className="mr-2" /> I'm Ready
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
};
