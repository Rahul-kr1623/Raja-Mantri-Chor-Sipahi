import { useCallback, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useSettingsStore } from '../store/settingsStore';

// Simple beep fallback if sound files are missing
const playFallbackBeep = (freq = 440, type: OscillatorType = 'sine', duration = 100) => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration/1000);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration/1000);
  } catch (e) {
    // Ignore
  }
};

const SOUNDS = {
  click: { src: '/sounds/click.mp3', fallback: () => playFallbackBeep(600, 'sine', 50) },
  join: { src: '/sounds/join.mp3', fallback: () => playFallbackBeep(800, 'triangle', 150) },
  flip: { src: '/sounds/flip.mp3', fallback: () => playFallbackBeep(300, 'square', 100) },
  correct: { src: '/sounds/correct.mp3', fallback: () => playFallbackBeep(1200, 'sine', 300) },
  wrong: { src: '/sounds/wrong.mp3', fallback: () => playFallbackBeep(200, 'sawtooth', 400) },
  win: { src: '/sounds/win.mp3', fallback: () => playFallbackBeep(1000, 'sine', 500) },
  tick: { src: '/sounds/tick.mp3', fallback: () => playFallbackBeep(800, 'sine', 50) },
};

type SoundType = keyof typeof SOUNDS;

export const useSound = () => {
  const isSoundMuted = useSettingsStore((state) => state.isSoundMuted);
  const howls = useRef<Record<string, Howl>>({});

  useEffect(() => {
    // Preload sounds
    Object.entries(SOUNDS).forEach(([key, conf]) => {
      howls.current[key] = new Howl({
        src: [conf.src],
        preload: true,
        volume: 0.5,
        onloaderror: () => {
          // If file not found, we rely on the fallback
          howls.current[key].unload();
          delete howls.current[key];
        }
      });
    });

    return () => {
      Object.values(howls.current).forEach(h => h.unload());
    };
  }, []);

  const play = useCallback((type: SoundType) => {
    if (isSoundMuted) return;

    if (howls.current[type]) {
      howls.current[type].play();
    } else {
      // Fallback
      SOUNDS[type].fallback();
    }
  }, [isSoundMuted]);

  return { play };
};
