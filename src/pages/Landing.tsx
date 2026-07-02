import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/common/Button';
import { motion } from 'motion/react';
import { PageTransition } from '../components/animations/PageTransition';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="flex flex-1 flex-col items-center justify-center relative">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="z-10 flex flex-col items-center max-w-2xl w-full text-center"
        >
          <div className="mb-6 inline-flex items-center justify-center rounded-sm bg-[var(--color-heritage-paper-dark)] px-6 py-2 tactile-border shadow-[var(--shadow-tactile-sm)]">
            <span className="heritage-subheading">Classic Indian Game</span>
          </div>
          
          <h1 className="mb-2 text-6xl md:text-8xl heritage-heading font-black">
            Raja Mantri
          </h1>
          <h1 className="mb-10 text-5xl md:text-7xl heritage-heading font-black text-[var(--color-heritage-saffron)]">
            Chor Sipahi
          </h1>
          
          <p className="mb-14 text-lg text-[var(--color-heritage-indigo)] max-w-md mx-auto leading-relaxed font-medium">
            Experience the nostalgic childhood game online. Bluff your way to victory in this fast-paced 4-player multiplayer game.
          </p>

          <div className="flex w-full flex-col sm:flex-row items-center justify-center gap-4 px-4">
            <Button 
              size="lg" 
              className="w-full sm:w-auto min-w-[200px]"
              onClick={() => navigate('/create')}
            >
              Create Room
            </Button>
            <Button 
              size="lg" 
              variant="secondary"
              className="w-full sm:w-auto min-w-[200px]"
              onClick={() => navigate('/join')}
            >
              Join Room
            </Button>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};
