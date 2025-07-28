import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Text, View } from "react-native";

export default function ConvexPage() {
  const count = useQuery(api.main.getUserCount);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>{count} users</Text>
    </View>
  );
}