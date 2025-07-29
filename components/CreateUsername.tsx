// src/components/CreateUsername.tsx
import { api } from "@/lib/convex";
import { useMutation } from "convex/react";
import { useState } from "react";
import { View, Text } from "react-native";
import "../app/global.css";
import { ButtonDotlists } from "./ui/button";
import { Input } from "./ui/input";

export function CreateUsername() {
  const [username, setUsername] = useState("");
  const createProfile = useMutation(api.main.createUserProfile);
  const [error, setError] = useState("");

  const handleCreateProfile = async () => {
    setError("");
    try {
      await createProfile({ username });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <View className="flex flex-col items-center justify-center h-screen">
      <View className="w-full max-w-xs">
        <Text className="text-2xl font-bold mb-4 text-center">
          Choose a Username
        </Text>
        <Text className="text-muted-foreground mb-6 text-center">
          This will be your unique name for sharing and invitations.
        </Text>
        <Input
          value={username}
          onChangeText={(text) => setUsername(text.toLowerCase())}
          placeholder="username"
          className="mb-2"
          autoCapitalize="none"
        />
        <ButtonDotlists onPress={handleCreateProfile} className="w-full">
          <Text>Create Profile</Text>
        </ButtonDotlists>
        {error && <Text className="text-red-500 mt-2 text-sm">{error}</Text>}
      </View>
    </View>
  );
}