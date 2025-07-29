// src/contexts/ThemeProvider.tsx
import { themes } from '@/lib/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState, type ReactNode, useMemo } from 'react';
import { Platform } from 'react-native';
import { ThemeContext } from './ThemeContextDef';

type Theme = "light" | "dark" | "gruvbox" | "blue" | "monochrome";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('gruvbox');

  useEffect(() => {
    const loadTheme = async () => {
      let storedTheme: Theme | null = null;
      try {
        if (Platform.OS === 'web') {
          storedTheme = localStorage.getItem("theme") as Theme | null;
        } else {
          storedTheme = await AsyncStorage.getItem("theme") as Theme | null;
        }
      } catch (e) {
        console.error("Failed to load theme", e);
      }

      if (storedTheme && themes[storedTheme]) {
        setThemeState(storedTheme);
      }
    };
    loadTheme();
  }, []);

  const setTheme = (newTheme: Theme) => {
    if (!themes[newTheme]) {
      console.warn(`Theme "${newTheme}" not found.`);
      return;
    }
    setThemeState(newTheme);
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem("theme", newTheme);
      } else {
        AsyncStorage.setItem("theme", newTheme);
      }
    } catch (e) {
      console.error("Failed to save theme", e);
    }
  };

  const themeVariables = useMemo(() => themes[theme], [theme]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      for (const [key, value] of Object.entries(themeVariables)) {
        document.documentElement.style.setProperty(key, value);
      }
    }
  }, [themeVariables]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeVariables }}>
      {children}
    </ThemeContext.Provider>
  );
};
