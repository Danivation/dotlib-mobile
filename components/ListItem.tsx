import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSettings } from "@/contexts/SettingsContext";
import type { Doc, Id } from "@/lib/convex";
import { api } from "@/lib/convex";
import clsx from "clsx";
import { useAction, useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  MoreVertical,
  Sparkles,
  Trash2,
  User,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, TextInput } from "react-native";
import "../app/global.css";
import { CommentSection } from "./CommentSection";
import { SubtaskItem } from "./SubtaskItem";
import { ButtonDotlists } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";

interface ListItemProps {
  node: Doc<"items"> & { uuid: Id<"items"> };
  handleUpdateItem: (
    id: Id<"items">,
    updates: Partial<Doc<"items">>,
  ) => void;
  handleDeleteItem: (id: Id<"items">) => void;
  focusedItemId: Id<"items"> | null;
  setFocusedItemId: (id: Id<"items"> | null) => void;
  listId: Id<"lists">;
  teamId?: Id<"teams">;
}

const stateOrder = { red: 0, yellow: 1, green: 2 } as const;
const stateOrderReversed = ["red", "yellow", "green"] as const;

export function ListItem({
  node,
  handleUpdateItem,
  handleDeleteItem,
  focusedItemId,
  setFocusedItemId,
  listId,
  teamId,
}: ListItemProps) {
  const { isSimpleMode } = useSettings();
  const [text, setText] = useState(node.text);
  const [isCommenting, setIsCommenting] = useState(false);
  const [isSubtasksVisible, setIsSubtasksVisible] = useState(false);
  const [newSubtaskText, setNewSubtaskText] = useState("");
  const textareaRef = useRef<TextInput>(null);
  const breakdownTask = useAction(api.gemini.breakdownTask);
  const teamMembers = useQuery(
    api.teams.getTeamMembers,
    teamId ? { teamId } : "skip",
  );
  const subtasks = useQuery(api.subtasks.getSubtasks, { parentId: node.uuid });
  const createSubtask = useMutation(api.subtasks.createSubtask);

  const handleBreakdownTask = async () => {
    const subtaskStrings = await breakdownTask({
      listId,
      taskId: node.uuid,
      taskText: text,
    });
    if (subtaskStrings && subtaskStrings.length > 0) {
      for (const subtaskText of subtaskStrings) {
        await createSubtask({
          parentId: node.uuid,
          text: subtaskText,
          state: "todo",
        });
      }
      setIsSubtasksVisible(true);
    }
  };

  useEffect(() => {
    if (node.uuid === focusedItemId) {
      textareaRef.current?.focus();
      setFocusedItemId(null);
    }
  }, [focusedItemId, node.uuid, setFocusedItemId]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (text !== node.text) {
        handleUpdateItem(node.uuid, { text });
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [text, node.text, node.uuid, handleUpdateItem]);

  const handleCreateSubtask = async () => {
    if (newSubtaskText.trim() !== "") {
      await createSubtask({
        parentId: node.uuid,
        text: newSubtaskText.trim(),
        state: "todo",
      });
      setNewSubtaskText("");
    }
  };

  let statusColor = node.state;
  if (subtasks && subtasks.length > 0) {
    const doneCount = subtasks.filter((s) => s.state === "done").length;
    const inProgressCount = subtasks.filter(
      (s) => s.state === "in progress",
    ).length;

    if (doneCount === subtasks.length) {
      statusColor = "green";
    } else if (doneCount > 0 || inProgressCount > 0) {
      statusColor = "yellow";
    } else {
      statusColor = "red";
    }
  }

  const colorClass =
    statusColor === "red"
      ? "bg-red-500"
      : statusColor === "yellow"
      ? "bg-yellow-500"
      : "bg-green-500";

  const assignee = teamMembers?.find(
    (member) => member.userId === node.assigneeId,
  );

  return (
    <View
      className="flex flex-col hover:bg-muted/50 rounded-lg my-1 p-1"
      key={node.uuid}
    >
      <View className="flex flex-row items-center">
        <ButtonDotlists
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onPress={() => setIsSubtasksVisible(!isSubtasksVisible)}
        >
          {isSubtasksVisible ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </ButtonDotlists>
        <TouchableOpacity
          onPress={() => {
            const currentState = node.state as keyof typeof stateOrder;
            const newState = (stateOrder[currentState] + 1) % 3;
            handleUpdateItem(node.uuid, {
              state: stateOrderReversed[newState],
            });
          }}
          onLongPress={(e) => {
            const currentState = node.state as keyof typeof stateOrder;
            const newState = (stateOrder[currentState] + 2) % 3;
            handleUpdateItem(node.uuid, {
              state: stateOrderReversed[newState],
            });
          }}
          className={clsx(
            "mx-2 transition-all duration-100 flex-shrink-0 w-6 h-6 rounded-full",
            colorClass,
          )}
        />
        <TextInput
          ref={textareaRef}
          value={text}
          onChangeText={setText}
          className="text-sm md:text-base self-center w-full border-none bg-transparent text-foreground"
          multiline
          onBlur={(e) => {
            const trimmed = e.nativeEvent.text.trim();
            if (trimmed === "") {
              handleDeleteItem(node.uuid);
            } else if (trimmed !== node.text) {
              handleUpdateItem(node.uuid, { text: trimmed });
            }
          }}
          onKeyPress={({ nativeEvent: { key: e } }) => {
            if (e === "Backspace" && text === "") {
              handleDeleteItem(node.uuid);
            }
          }}
        />
        <View className="flex flex-row items-center self-center">
          {node.dueDate && (
            <Text className="text-xs text-gray-500 mr-2 whitespace-nowrap">
              {format(new Date(node.dueDate), "MMM d")}
            </Text>
          )}
          <ButtonDotlists
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onPress={() => handleDeleteItem(node.uuid)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </ButtonDotlists>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <ButtonDotlists variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4 text-foreground" />
              </ButtonDotlists>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setIsCommenting(!isCommenting)}>
                <MessageSquare className="mr-2 h-4 w-4 text-foreground" />
                <Text className="text-foreground">{isCommenting ? "hide comments" : "show comments"}</Text>
              </DropdownMenuItem>

              {!isSimpleMode && teamId && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <User className="mr-2 h-4 w-4 text-foreground" />
                    <Text className="text-foreground">{assignee ? `assign: ${assignee.username}` : "assign"}</Text>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onSelect={() =>
                        handleUpdateItem(node.uuid, { assigneeId: undefined })
                      }
                    >
                      <Text className="text-foreground">unassigned</Text>
                    </DropdownMenuItem>
                    {teamMembers?.map((member) => (
                      <DropdownMenuItem
                        key={member.userId}
                        onSelect={() =>
                          handleUpdateItem(node.uuid, {
                            assigneeId: member.userId,
                          })
                        }
                      >
                        <Text className="text-foreground">{member.username}</Text>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              )}

              <Popover>
                <PopoverTrigger>
                    <View className="flex-row items-center p-2">
                        <CalendarIcon className="mr-2 h-4 w-4 text-foreground" />
                        <Text className="text-foreground">set due date</Text>
                    </View>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Text className="text-foreground">Date picker not available on mobile</Text>
                </PopoverContent>
              </Popover>

              {!isSimpleMode && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleBreakdownTask}>
                    <Sparkles className="mr-2 h-4 w-4 text-foreground" />
                    <Text className="text-foreground">breakdown task</Text>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </View>
      </View>
      {isSubtasksVisible && (
          <View
            className="ml-12 mt-2"
          >
            <View>
              {subtasks?.map((subtask) => (
                <SubtaskItem key={subtask._id} subtask={subtask} />
              ))}
            </View>
            <View className="flex flex-row items-center mt-2">
              <Input
                value={newSubtaskText}
                onChangeText={setNewSubtaskText}
                placeholder="new subtask..."
                className="h-8 flex-1"
                onSubmitEditing={handleCreateSubtask}
              />
              <ButtonDotlists onPress={handleCreateSubtask} size="sm" className="ml-2">
                <Text>add</Text>
              </ButtonDotlists>
            </View>
          </View>
        )}
      {isCommenting && <CommentSection itemId={node.uuid} />}
    </View>
  );
}

