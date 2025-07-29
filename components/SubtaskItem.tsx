// src/components/SubtaskItem.tsx
import type { Doc } from "@/lib/convex";
import { api } from "@/lib/convex";
import clsx from "clsx";
import { useMutation } from "convex/react";
import { Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import "../app/global.css";
import { ButtonDotlists } from "./ui/button";
import { Input } from "./ui/input";

const subtaskStateOrder = { todo: 0, "in progress": 1, done: 2 } as const;
const subtaskStateOrderReversed = ["todo", "in progress", "done"] as const;

interface SubtaskItemProps {
  subtask: Doc<"subtasks">;
}

export function SubtaskItem({ subtask }: SubtaskItemProps) {
  const updateSubtask = useMutation(api.subtasks.updateSubtask);
  const deleteSubtask = useMutation(api.subtasks.deleteSubtask);
  const [text, setText] = useState(subtask.text);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (text !== subtask.text) {
        updateSubtask({ subtaskId: subtask._id, text });
      }
    }, 500); // Debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [text, subtask.text, subtask._id, updateSubtask]);

  const subtaskColorClass =
    subtask.state === "todo"
      ? "bg-red-500"
      : subtask.state === "in progress"
      ? "bg-yellow-500"
      : "bg-green-500";

  return (
    <View
      className="flex flex-row items-center"
    >
      <TouchableOpacity
        onPress={() => {
          const currentState = subtask.state as keyof typeof subtaskStateOrder;
          const newState = (subtaskStateOrder[currentState] + 1) % 3;
          updateSubtask({
            subtaskId: subtask._id,
            state: subtaskStateOrderReversed[newState],
          });
        }}
        onLongPress={() => {
          const currentState = subtask.state as keyof typeof subtaskStateOrder;
          const newState = (subtaskStateOrder[currentState] + 2) % 3;
          updateSubtask({
            subtaskId: subtask._id,
            state: subtaskStateOrderReversed[newState],
          });
        }}
        className={clsx(
          "w-4 h-4 mx-2 rounded-full transition-all duration-100 flex-shrink-0",
          subtaskColorClass,
        )}
      />
      <Input
        value={text}
        onChangeText={setText}
        className="h-8 border-none bg-transparent flex-1 text-foreground"
      />
      <ButtonDotlists
        variant="ghost"
        size="icon"
        onPress={() => deleteSubtask({ subtaskId: subtask._id })}
        className="h-6 w-6"
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </ButtonDotlists>
    </View>
  );
}
