import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import confetti from 'canvas-confetti';
import { useSettingsStore } from '../../store/settingsStore';

export interface ConfettiHandle {
  fire: () => void;
  celebration: () => void;
  fireworks: () => void;
}

export const ConfettiEffect = forwardRef<ConfettiHandle, {}>((_, ref) => {
  // Use reduced motion settings or custom settings here if desired
  
  useImperativeHandle(ref, () => ({
    fire: () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#2ECC71', '#1E3A8A', '#DC143C']
      });
    },
    celebration: () => {
      const end = Date.now() + 3000;
      const colors = ['#FFD700', '#FF9933'];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    },
    fireworks: () => {
      const duration = 5000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);
    }
  }));

  return null;
});

ConfettiEffect.displayName = 'ConfettiEffect';
