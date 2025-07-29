// src/components/AddTaskBar.tsx
import { useTheme } from "@/hooks/useTheme";
import clsx from "clsx";
import { Plus } from "lucide-react-native";
import { View, Text } from "react-native";
import "../app/global.css";
import { ButtonDotlists } from "./ui/button";

interface AddTaskBarProps {
  handleAddItem: () => void;
}

export function AddTaskBar({ handleAddItem }: AddTaskBarProps) {
  const { theme } = useTheme();

  return (
    <View className="px-4 py-2">
      <ButtonDotlists
        onPress={handleAddItem}
        variant="outline"
        className={clsx(
          "w-full justify-start flex-row items-center",
          theme === "blue" && "bg-blue-500 text-white hover:bg-blue-600"
        )}
      >
        <Plus className="h-4 w-4 mr-2" color={theme === "blue" ? "white" : "black"} />
        <Text className={clsx(theme === "blue" && "text-white")}>add new task</Text>
      </ButtonDotlists>
    </View>
  );
}
