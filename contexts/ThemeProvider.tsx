// src/contexts/ThemeProvider.tsx
import { getCookie, setCookie } from '@/lib/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from "nativewind";
import { useEffect, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';
import { ThemeContext } from './ThemeContextDef';

type Theme = "light" | "dark" | "gruvbox" | "blue" | "monochrome";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { setColorScheme } = useColorScheme();
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    const loadTheme = async () => {
      let storedTheme: Theme | null = null;
      try {
        if (Platform.OS === 'web') {
          storedTheme = getCookie("theme") as Theme | null;
        } else {
          storedTheme = await AsyncStorage.getItem("theme") as Theme | null;
        }
      } catch (e) {
        console.error("Failed to load theme", e);
        // Silently fail
      }


      if (storedTheme) {
        setThemeState(storedTheme);
        if (Platform.OS === 'web') {
          document.documentElement.className = storedTheme;
          document.body.className = storedTheme;
        }
      }
    };
    loadTheme();
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      if (Platform.OS === 'web') {
        setCookie("theme", newTheme, 365);
        document.documentElement.className = newTheme;
        document.body.className = newTheme;
      } else {
        AsyncStorage.setItem("theme", newTheme);
        // We don't call setColorScheme here anymore with custom themes
      }
    } catch (e) {
      console.error("Failed to save theme", e);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
