import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from 'expo-router';
import "./global.css";

export const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Home', headerShown: false}} />
        <Stack.Screen name="about" options={{ title: 'About' }} />
        <Stack.Screen name="dotlists" options={{ title: 'Dotlists' }} />
      </Stack>
    </ConvexProvider>
  );
}
