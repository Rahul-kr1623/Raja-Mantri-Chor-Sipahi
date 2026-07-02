import React from 'react';
import { Toaster as HotToaster } from 'react-hot-toast';

export const Toast: React.FC = () => {
  return (
    <HotToaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: 'rgba(20, 20, 20, 0.8)',
          color: '#fff',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
          padding: '12px 24px',
          fontWeight: 500,
        },
        success: {
          iconTheme: {
            primary: 'var(--color-emerald)',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: 'var(--color-crimson)',
            secondary: '#fff',
          },
        },
      }}
    />
  );
};
