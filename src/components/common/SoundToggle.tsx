import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { motion, AnimatePresence } from 'motion/react';

export const SoundToggle: React.FC = () => {
  const isSoundMuted = useSettingsStore(state => state.isSoundMuted);
  const toggleSound = useSettingsStore(state => state.toggleSound);

  return (
    <button
      onClick={toggleSound}
      className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all hover:bg-white/20 hover:text-white"
      aria-label="Toggle sound"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isSoundMuted ? (
          <motion.div
            key="muted"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <VolumeX size={20} className="text-red-400" />
          </motion.div>
        ) : (
          <motion.div
            key="unmuted"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Volume2 size={20} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};
