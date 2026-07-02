import React from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toast } from './components/common/Toast';
import { useDarkMode } from './hooks/useDarkMode';
import { useSound } from './hooks/useSound';

function App() {
  // Initialize app-wide effects
  useDarkMode();
  useSound(); // Preloads sounds on mount

  return (
    <>
      <RouterProvider router={router} />
      <Toast />
    </>
  );
}

export default App;
