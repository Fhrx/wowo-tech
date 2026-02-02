// src/stores/hooks/useTheme.js
import { useThemeStore } from '../themeStore';
import { useEffect } from 'react';

export default function useTheme() {
  const { isDarkMode, toggleTheme, setDarkMode, initializeTheme } = useThemeStore();

  // Initialize theme sekali saat mount
  useEffect(() => {
    // HANYA panggil initializeTheme yang TIDAK setState di dalamnya
    const initialTheme = initializeTheme();
    
    // Sync store dengan initial theme
    if (initialTheme !== isDarkMode) {
      setDarkMode(initialTheme);
    }
  }, []); // Empty dependency array

  return {
    isDarkMode,
    toggleTheme,
    setDarkMode,
  };
}