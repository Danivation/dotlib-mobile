import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { Stack } from 'expo-router';
import * as SecureStore from "expo-secure-store";
import { Platform } from 'react-native';
import "./global.css";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const secureStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};

export default function RootLayout() {
  return (
    <ConvexAuthProvider 
      client={convex}
      storage={
        Platform.OS === "android" || Platform.OS === "ios"
          ? secureStorage
          : undefined
      }
    >
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Home', headerShown: false}} />
        <Stack.Screen name="about" options={{ title: 'About' }} />
        <Stack.Screen name="dotlists" options={{ title: 'Dotlists' }} />
      </Stack>
    </ConvexAuthProvider >
  );
}
