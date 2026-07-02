import React from 'react';
import { motion } from 'motion/react';
import { Crown, Shield, Search, Sword } from 'lucide-react';

export const FloatingCards: React.FC = () => {
  const cards = [
    { icon: Crown, color: 'var(--color-royal-gold)', initial: { x: -100, y: -50, rotate: -15 } },
    { icon: Shield, color: 'var(--color-emerald)', initial: { x: 100, y: -100, rotate: 10 } },
    { icon: Sword, color: 'var(--color-royal-blue)', initial: { x: -150, y: 100, rotate: -20 } },
    { icon: Search, color: 'var(--color-crimson)', initial: { x: 150, y: 50, rotate: 25 } },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
      <div className="relative h-full w-full max-w-7xl mx-auto flex items-center justify-center">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={card.initial}
            animate={{
              y: [card.initial.y - 20, card.initial.y + 20, card.initial.y - 20],
              rotate: [card.initial.rotate - 5, card.initial.rotate + 5, card.initial.rotate - 5],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute rounded-xl border border-white/20 bg-white/5 p-8 shadow-2xl backdrop-blur-md"
            style={{ 
              boxShadow: `0 10px 40px -10px ${card.color}40`,
            }}
          >
            <card.icon size={64} style={{ color: card.color }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
