import { useState, useEffect, useCallback } from 'react';
import { useSound } from './useSound';

export const useCountdown = (initialSeconds: number, onComplete?: () => void) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const { play } = useSound();

  const start = useCallback(() => {
    setSeconds(initialSeconds);
    setIsRunning(true);
  }, [initialSeconds]);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    if (seconds > 0) {
      play('tick');
      const timer = setTimeout(() => setSeconds(s => s - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsRunning(false);
      if (onComplete) onComplete();
    }
  }, [seconds, isRunning, onComplete, play]);

  return { seconds, isRunning, start, stop };
};
