// src/contexts/ThemeContextDef.ts
import { createContext } from 'react';

type Theme = "light" | "dark" | "gruvbox" | "blue" | "monochrome";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themeVariables: Record<string, string>;
}

export const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    setTheme: () => {},
    themeVariables: {},
});
