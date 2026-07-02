import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'role' | 'host';
  color?: string; // For role-specific colors
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  color,
  className 
}) => {
  const variants = {
    default: 'bg-white/20 text-white',
    success: 'bg-green-500/20 text-green-300 border border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    error: 'bg-red-500/20 text-red-300 border border-red-500/30',
    role: 'text-white border border-white/20 shadow-lg',
    host: 'bg-yellow-500 text-slate-900 font-bold tracking-wider uppercase text-[10px]',
  };

  return (
    <span 
      className={clsx(
        'inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm transition-all',
        variants[variant],
        className
      )}
      style={variant === 'role' && color ? { backgroundColor: color } : undefined}
    >
      {children}
    </span>
  );
};
