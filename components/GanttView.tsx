import { Text, View } from "react-native";
import { memo } from "react";
import type { Id } from "@/lib/convex";

interface GanttViewProps {
  listId: Id<"lists">;
}

export const GanttView = memo(function GanttView({ listId }: GanttViewProps) {
  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-lg text-muted-foreground">
        Gantt chart view is not available on mobile.
      </Text>
    </View>
  );
});
