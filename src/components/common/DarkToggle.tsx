import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { motion, AnimatePresence } from 'motion/react';

export const DarkToggle: React.FC = () => {
  const isDarkMode = useSettingsStore(state => state.isDarkMode);
  const toggleDarkMode = useSettingsStore(state => state.toggleDarkMode);

  return (
    <button
      onClick={toggleDarkMode}
      className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all hover:bg-white/20 hover:text-white"
      aria-label="Toggle dark mode"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDarkMode ? (
          <motion.div
            key="moon"
            initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Moon size={20} />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Sun size={20} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};
