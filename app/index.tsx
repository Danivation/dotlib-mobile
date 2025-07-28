import SettingsProvider from "@/contexts/SettingsProvider";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { View } from 'react-native';
import { convex } from "./_layout";
import App from "./App";

export default function Index() {
  return (
    <View className="h-full">
      <ConvexAuthProvider client={convex}>
        <ThemeProvider>
          <SettingsProvider>
            <App />
          </SettingsProvider>
        </ThemeProvider>
      </ConvexAuthProvider>
    </View>
  );
}