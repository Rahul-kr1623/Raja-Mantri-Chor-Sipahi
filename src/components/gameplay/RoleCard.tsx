import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Role } from '../../types';
import { ROLE_INFO } from '../../constants';
import { Button } from '../common/Button';
import { Crown, Shield, Search, Sword } from 'lucide-react';
import { useSound } from '../../hooks/useSound';

interface RoleCardProps {
  role: Role | null;
  onUnderstand: () => void;
  isVisible: boolean;
}

const ICONS = {
  Crown,
  Shield,
  Search,
  Sword,
};

export const RoleCard: React.FC<RoleCardProps> = ({ role, onUnderstand, isVisible }) => {
  const { play } = useSound();

  if (!role) return null;

  const info = ROLE_INFO[role];
  const Icon = ICONS[info.icon as keyof typeof ICONS] || Sword;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.8, rotateY: 90, opacity: 0 }}
            animate={{ scale: 1, rotateY: 0, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100, duration: 0.6 }}
            onAnimationComplete={() => {
              if (isVisible) play('flip');
            }}
            className="relative flex w-[90vw] sm:w-full max-w-sm flex-col items-center justify-between rounded-md p-6 sm:p-8 shadow-2xl bg-[var(--color-heritage-paper)] border-4 border-white"
            style={{
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' // Physical heavy card shadow
            }}
          >
            {/* Card inner border */}
            <div className="absolute inset-2 border-2 border-[var(--color-heritage-indigo)] rounded-sm pointer-events-none opacity-20" />
            
            {/* Corner motifs */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[var(--color-heritage-saffron)]" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[var(--color-heritage-saffron)]" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[var(--color-heritage-saffron)]" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[var(--color-heritage-saffron)]" />
            
            <div className="relative z-10 flex flex-col items-center text-center mt-4">
              <span className="mb-2 text-sm font-bold uppercase tracking-widest text-[var(--color-heritage-indigo)] opacity-70">
                Your Role Is
              </span>
              
              <div 
                className="mb-4 sm:mb-6 mt-2 sm:mt-4 flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-full border-4 shadow-[var(--shadow-tactile-sm)]"
                style={{ borderColor: info.color, backgroundColor: 'white' }}
              >
                <Icon className="w-12 h-12 sm:w-16 sm:h-16" style={{ color: info.color }} />
              </div>
              
              <h1 className="mb-1 text-4xl sm:text-5xl heritage-heading font-black" style={{ color: info.color }}>
                {info.name}
              </h1>
              
              <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl heritage-heading text-[var(--color-heritage-indigo)] opacity-80">
                ({info.hindiName})
              </h2>
              
              <p className="mb-6 sm:mb-10 text-base sm:text-lg text-[var(--color-heritage-indigo)] leading-relaxed max-w-[250px] font-medium">
                {info.description}
              </p>
              
              <Button 
                onClick={onUnderstand}
                variant="primary"
                className="w-full"
                size="lg"
              >
                I Understand
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
