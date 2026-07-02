import React, { useEffect, useRef } from 'react';
import { useRoomStore } from '../../store/roomStore';
import { motion, AnimatePresence } from 'motion/react';

export const ActivityLog: React.FC = () => {
  const room = useRoomStore(state => state.room);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const logs = room?.activityLogs || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs.length]);

  if (!room) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 w-48 sm:w-64 h-24 sm:h-32 pointer-events-none">
      <div 
        ref={scrollRef}
        className="w-full h-full overflow-y-hidden flex flex-col justify-end space-y-1"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 40%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 40%)'
        }}
      >
        <AnimatePresence initial={false}>
          {logs.slice(-5).map(log => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="px-2 py-1 bg-white/80 backdrop-blur-sm border-l-2 border-[var(--color-heritage-saffron)] rounded-r-sm shadow-[var(--shadow-tactile-sm)]"
            >
              <span className="text-[10px] font-bold text-[var(--color-heritage-indigo)]">
                {log.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
