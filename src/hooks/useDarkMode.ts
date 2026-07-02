import { useEffect } from 'react';
import { useSettingsStore } from '../store/settingsStore';

export const useDarkMode = () => {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      // Tailwind v4 uses CSS variables for dark mode by default if configured,
      // or we can just apply a class to body/html
      // In this setup, our default is dark theme styling anyway
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);
};
