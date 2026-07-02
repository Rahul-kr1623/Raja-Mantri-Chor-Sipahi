import React, { useState } from 'react';
import { Player, Role } from '../../types';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { motion } from 'motion/react';

interface GuessCardProps {
  players: Record<string, Player>;
  myRole: Role | null;
  onGuess: (guessedId: string) => void;
}

export const GuessCard: React.FC<GuessCardProps> = ({ players, myRole, onGuess }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Mantri must guess who is the Chor.
  // Raja and Mantri are known. Only Sipahi and Chor are left to guess from.
  const unknownPlayers = Object.values(players).filter(p => p.role !== Role.Raja && p.role !== Role.Mantri);

    if (myRole === Role.Mantri) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto bg-white p-8 tactile-card z-20">
        <h2 className="text-3xl heritage-heading font-black text-center mb-2">Find the Chor</h2>
        <p className="text-[var(--color-heritage-indigo)] opacity-80 font-bold mb-8 text-center text-sm uppercase tracking-widest">Select who you think is the Chor</p>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full mb-8">
          {unknownPlayers.map(p => (
            <motion.div
              key={p.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedId(p.id)}
              className={`flex flex-col items-center justify-center p-4 sm:p-6 rounded-md cursor-pointer transition-all ${
                selectedId === p.id 
                  ? 'bg-[var(--color-heritage-paper-dark)] border-4 border-[var(--color-heritage-saffron)] shadow-[var(--shadow-tactile-md)]' 
                  : 'bg-white tactile-border hover:bg-[var(--color-heritage-paper)]'
              }`}
            >
              <Avatar emoji={p.avatar} size="lg" className="mb-2 sm:mb-4" />
              <span className="font-bold text-lg sm:text-xl text-[var(--color-heritage-indigo)]">{p.name}</span>
            </motion.div>
          ))}
        </div>

        <Button 
          size="lg" 
          disabled={!selectedId}
          onClick={() => selectedId && onGuess(selectedId)}
          className="w-full max-w-xs"
        >
          Confirm Guess
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center text-center w-full max-w-md mx-auto p-8 bg-white tactile-card z-20">
      <h2 className="text-3xl heritage-heading font-black mb-4">Mantri is thinking...</h2>
      <p className="text-[var(--color-heritage-indigo)] opacity-80 font-bold text-sm uppercase tracking-widest">The Mantri is trying to find the Chor.</p>
      
      {myRole === Role.Chor && (
        <div className="mt-8 p-4 rounded-sm border-2 border-[var(--color-heritage-saffron)] bg-[var(--color-heritage-paper-dark)] text-[var(--color-heritage-saffron)]">
          <p className="font-black text-lg">Act natural!</p>
          <p className="text-sm font-bold opacity-80">Don't let the Mantri catch you.</p>
        </div>
      )}
      
      {myRole === Role.Sipahi && (
        <div className="mt-8 p-4 rounded-sm border-2 border-[var(--color-heritage-indigo)] bg-[var(--color-heritage-paper-dark)] text-[var(--color-heritage-indigo)]">
          <p className="font-black text-lg">Stay calm.</p>
          <p className="text-sm font-bold opacity-80">Hope the Mantri doesn't pick you by mistake.</p>
        </div>
      )}
    </div>
  );
};
