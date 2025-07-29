import SettingsProvider from "@/contexts/SettingsProvider";
import { ThemeContext } from "@/contexts/ThemeContextDef";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { useContext } from "react";
import { View } from 'react-native';
import App from "./App";

function ThemedApp() {
  const { themeVariables } = useContext(ThemeContext);
  return (
    <View className="h-full" style={themeVariables as any}>
      <App />
    </View>
  )
}

export default function Index() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <ThemedApp />
      </SettingsProvider>
    </ThemeProvider>
  );
}