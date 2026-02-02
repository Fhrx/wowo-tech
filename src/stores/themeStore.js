// src/stores/themeStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      isDarkMode: false,
      
      initializeTheme: () => {
        // HANYA baca dari localStorage/prefers-color-scheme, TIDAK setState
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const initialTheme = savedTheme === 'dark' || (!savedTheme && prefersDark);
        
        // Apply ke DOM langsung
        if (initialTheme) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        
        return initialTheme;
      },
      
      toggleTheme: () => {
        set((state) => {
          const newMode = !state.isDarkMode;
          
          // Update DOM
          if (newMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          
          return { isDarkMode: newMode };
        });
      },
      
      setDarkMode: (isDark) => {
        set({ isDarkMode: isDark });
        
        // Update DOM
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }),
    {
      name: 'wowotech-theme',
    }
  )
);