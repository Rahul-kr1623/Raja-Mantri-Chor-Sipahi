import React from 'react';
import { motion } from 'motion/react';
import { useSound } from '../../hooks/useSound';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, children, onClick, disabled, ...props }, ref) => {
    const { play } = useSound();

    const baseStyles = 'relative inline-flex items-center justify-center font-bold tracking-wide transition-all uppercase rounded-lg border-2 border-[var(--color-heritage-indigo)]';
    
    const variants = {
      primary: 'bg-[var(--color-heritage-saffron)] text-[#FFFFFF] shadow-[var(--shadow-tactile-md)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-tactile-lg)] active:translate-y-1 active:shadow-[var(--shadow-tactile-active)]',
      secondary: 'bg-[var(--color-heritage-paper-dark)] text-[var(--color-heritage-indigo)] shadow-[var(--shadow-tactile-md)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-tactile-lg)] active:translate-y-1 active:shadow-[var(--shadow-tactile-active)]',
      ghost: 'border-transparent text-[var(--color-heritage-indigo)] hover:bg-[var(--color-heritage-paper-dark)] active:translate-y-0.5',
      danger: 'bg-red-600 text-white shadow-[var(--shadow-tactile-md)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-tactile-lg)] active:translate-y-1 active:shadow-[var(--shadow-tactile-active)]'
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base'
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !isLoading) {
        play('click');
        onClick?.(e);
      }
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        onClick={handleClick}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
          disabled || isLoading ? 'opacity-50 cursor-not-allowed transform-none shadow-[var(--shadow-tactile-active)]' : ''
        } ${className}`}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : null}
        <span className="relative z-10">{children as React.ReactNode}</span>
      </button>
    );
  }
);
Button.displayName = 'Button';
