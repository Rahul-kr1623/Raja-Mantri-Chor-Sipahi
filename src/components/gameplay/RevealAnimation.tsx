import React, { useEffect, useState } from 'react';
import { Player, GuessResult, Role } from '../../types';
import { ROLE_INFO, SCORING } from '../../constants';
import { Avatar } from '../common/Avatar';
import { motion } from 'motion/react';
import { useSound } from '../../hooks/useSound';

interface RevealAnimationProps {
  players: Record<string, Player>;
  guess: GuessResult | null;
  myId: string;
}

export const RevealAnimation: React.FC<RevealAnimationProps> = ({ players, guess, myId }) => {
  const { play } = useSound();
  const [showScores, setShowScores] = useState(false);

  useEffect(() => {
    if (guess) {
      play(guess.correct ? 'correct' : 'wrong');
      const timer = setTimeout(() => {
        setShowScores(true);
      }, 2500); // Wait for cards to flip and outcome to be read
      return () => clearTimeout(timer);
    }
  }, [guess, play]);

  if (!guess) return null;

  const playerArray = Object.values(players);
  const mantri = playerArray.find(p => p.role === Role.Mantri);
  const guessed = players[guess.guessedId];

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Title / Outcome */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-10 z-20"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-heritage-indigo)] opacity-80 mb-2 uppercase tracking-widest">
          Mantri guessed {guessed?.name} was the Chor
        </h2>
        
        {guess.correct ? (
          <h1 className="text-5xl sm:text-7xl heritage-heading font-black text-[var(--color-heritage-green)] drop-shadow-md">
            Correct!
          </h1>
        ) : (
          <h1 className="text-5xl sm:text-7xl heritage-heading font-black text-red-600 drop-shadow-md">
            Wrong!
          </h1>
        )}
      </motion.div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl px-4 z-20">
        {playerArray.map((p, i) => {
          const roleInfo = ROLE_INFO[p.role as Role];
          const isGuessed = p.id === guess.guessedId;
          const isMantri = p.role === Role.Mantri;
          
          let points = 0;
          if (p.role) {
            points = guess.correct ? SCORING[p.role].correct : SCORING[p.role].wrong;
          }

          let cardBorder = 'border-[var(--color-heritage-indigo)]';
          if (isGuessed) {
            cardBorder = guess.correct ? 'border-[var(--color-heritage-green)]' : 'border-red-600';
          }

          return (
            <motion.div
              key={p.id}
              initial={{ rotateY: 180, opacity: 0, scale: 0.8 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2, type: 'spring', damping: 15 }}
              onAnimationStart={() => setTimeout(() => play('flip'), i * 200)}
              className={`relative flex flex-col items-center p-4 sm:p-6 rounded-md bg-white border-4 ${cardBorder} shadow-[var(--shadow-tactile-lg)]`}
            >
              {/* Highlight Guessed Player */}
              {isGuessed && (
                <div className={`absolute -top-3 sm:-top-4 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-md ${guess.correct ? 'bg-[var(--color-heritage-green)] text-white' : 'bg-red-600 text-white'}`}>
                  {guess.correct ? 'CAUGHT!' : 'WRONG PERSON'}
                </div>
              )}
              
              {isMantri && (
                <div className="absolute -top-3 sm:-top-4 px-3 py-1 rounded-full bg-[var(--color-heritage-saffron)] text-white text-xs font-black uppercase tracking-widest shadow-md">
                  GUESSED
                </div>
              )}

              <Avatar emoji={p.avatar} size="lg" className="mb-2 sm:mb-4" />
              <h3 className="font-bold text-lg sm:text-xl text-[var(--color-heritage-indigo)] truncate w-full text-center">{p.name}</h3>
              {p.id === myId && <span className="text-xs text-[var(--color-heritage-indigo)] opacity-60 font-bold">(You)</span>}
              
              <div 
                className="w-full mt-4 py-2 text-center rounded-sm font-black border-2 border-[var(--color-heritage-indigo)]"
                style={{ backgroundColor: roleInfo?.color, color: 'white' }}
              >
                {roleInfo?.name}
              </div>

              {/* Points Reveal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showScores ? 1 : 0, y: showScores ? 0 : 20 }}
                className="mt-4 text-3xl sm:text-4xl font-black text-[var(--color-heritage-indigo)] drop-shadow-sm"
              >
                +{points}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
