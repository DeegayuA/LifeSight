import { useState, useEffect } from 'react';

    export const useTheme = () => {
      const [darkMode, setDarkMode] = useState(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
          return storedTheme === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      });

      useEffect(() => {
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
        if (darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }, [darkMode]);

      const toggleTheme = () => {
        setDarkMode((prevMode) => !prevMode);
      };

      return { darkMode, toggleTheme };
    };
