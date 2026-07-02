import React, { useEffect, useRef } from 'react';
import { useSettingsStore } from '../../store/settingsStore';

export const AnimatedBackground: React.FC = () => {
  const isDarkMode = useSettingsStore(state => state.isDarkMode);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{ x: number, y: number, radius: number, vx: number, vy: number, alpha: number }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    // Initialize particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        alpha: Math.random() * 0.5 + 0.1
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const particleColor = isDarkMode ? '255, 255, 255' : '255, 215, 0'; // White for dark mode, gold for light mode

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColor}, ${p.alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);

  return (
    <>
      <div className="fixed inset-0 -z-20 h-full w-full bg-slate-900 transition-colors duration-1000" />
      
      {/* Gradient Blobs */}
      <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden opacity-40 mix-blend-screen">
        <div className="absolute -left-[10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-[var(--color-royal-blue)] blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute right-[-10%] top-[20%] h-[50%] w-[30%] rounded-full bg-[var(--color-deep-purple)] blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute bottom-[-10%] left-[20%] h-[40%] w-[50%] rounded-full bg-[var(--color-emerald)] blur-[100px] animate-pulse" style={{ animationDuration: '9s', animationDelay: '4s' }} />
        <div className="absolute bottom-[10%] right-[10%] h-[30%] w-[30%] rounded-full bg-[var(--color-saffron)] blur-[80px] animate-pulse" style={{ animationDuration: '11s', animationDelay: '1s' }} />
      </div>

      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10 h-full w-full opacity-30"
      />
    </>
  );
};
