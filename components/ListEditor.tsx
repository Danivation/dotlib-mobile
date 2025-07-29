import { useTheme } from "@/hooks/useTheme";
import type { Doc, Id } from "@/lib/convex";
import clsx from "clsx";
import { FlatList, Text, View } from "react-native";
import "../app/global.css";
import { ListItem } from "./ListItem";
import { ButtonDotlists } from "./ui/button";

type ConvexItem = Doc<"items"> & { uuid: Id<"items"> };

interface ListEditorProps {
  state: {
    id: Id<"lists">;
    name: string;
    nodes: Array<ConvexItem>;
    teamId?: Id<"teams">;
  };
  handleUpdateItem: (
    id: Id<"items">,
    updates: Partial<Doc<"items">>,
  ) => void;
  handleAddItem: (text: string, state?: "red" | "yellow" | "green") => void;
  handleDeleteItem: (id: Id<"items">) => void;
  focusedItemId: Id<"items"> | null;
  setFocusedItemId: (id: Id<"items"> | null) => void;
}

export function ListEditor({
  state,
  handleUpdateItem,
  handleAddItem,
  handleDeleteItem,
  focusedItemId,
  setFocusedItemId,
}: ListEditorProps) {
  const { theme } = useTheme();
  const stateOrder = { red: 0, yellow: 1, green: 2 } as const;

  const sortedNodes = [...state.nodes].sort((a, b) => {
    const stateA = a.state as keyof typeof stateOrder;
    const stateB = b.state as keyof typeof stateOrder;
    const stateDiff = stateOrder[stateA] - stateOrder[stateB];
    if (stateDiff !== 0) return stateDiff;
    return a.text.localeCompare(b.text);
  });

  return (
    <FlatList
      className="px-2 md:px-3 mb-0"
      data={sortedNodes}
      keyExtractor={(item) => item.uuid}
      renderItem={({ item }) => (
        <ListItem
          node={item}
          handleUpdateItem={handleUpdateItem}
          handleDeleteItem={handleDeleteItem}
          focusedItemId={focusedItemId}
          setFocusedItemId={setFocusedItemId}
          listId={state.id}
          teamId={state.teamId}
        />
      )}
      ListHeaderComponent={
        <View
          className="flex justify-center my-2"
        >
          <ButtonDotlists
            onPress={() => handleAddItem("new task", "red")}
            variant="outline"
            className={clsx(
              "px-8",
              theme === "blue" && "bg-blue-500 text-white hover:bg-blue-600"
            )}
          >
            <Text className={clsx(theme === "blue" ? "text-white" : "text-foreground")}>
              add new task <Text className={clsx("ml-2 text-xs", theme === "blue" ? "text-blue-200" : "text-muted-foreground")}> (ctrl+shift+n)</Text>
            </Text>
          </ButtonDotlists>
        </View>
      }
    />
  );
}
