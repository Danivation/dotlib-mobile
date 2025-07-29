import SettingsProvider from "@/contexts/SettingsProvider";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { View } from 'react-native';
import App from "./App";

export default function Index() {
  return (
    <View className="h-full">
      <ThemeProvider>
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </ThemeProvider>
    </View>
  );
}