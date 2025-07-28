import SettingsProvider from "@/contexts/SettingsProvider";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { View } from 'react-native';
import { convex } from "./_layout";
import NativewindApp from "./NativewindApp";

export default function DotlistsScreen() {
  return (
    <View>
      <ConvexAuthProvider client={convex}>
        <ThemeProvider>
          <SettingsProvider>
            <NativewindApp />
          </SettingsProvider>
        </ThemeProvider>
      </ConvexAuthProvider>
    </View>
  );
}