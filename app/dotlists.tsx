import SettingsProvider from "@/contexts/SettingsProvider";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { View } from 'react-native';
import App from "./App";

export default function DotlistsScreen() {
  return (
    <View>
      <ThemeProvider>
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </ThemeProvider>
    </View>
  );
}