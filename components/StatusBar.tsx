

import { useSettings } from "@/contexts/SettingsContext";
import type { Doc, Id } from "@/lib/convex";
import clsx from "clsx";
import "../app/global.css";
import { Notifications } from "./Notifications";
import { ButtonDotlists } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";

import { useAuthActions } from "@convex-dev/auth/react";
import {
  BarChart3,
  ChevronDown,
  ChevronsRight,
  List,
  Menu,
  Settings as SettingsIcon,
} from "lucide-react-native";
import { Text, View } from "react-native";

type ConvexItem = Doc<"items"> & { uuid: Id<"items"> };
type ViewMode = "list" | "gantt";

interface StatusBarProps {
  isDesktopSidebarOpen: boolean;
  setIsDesktopSidebarOpen: (isOpen: boolean) => void;
  setIsMobileDrawerOpen: (isOpen: boolean) => void;
  lists: Array<{
    id: Id<"lists">;
    name: string;
    nodes: Array<ConvexItem>;
  }>;
  selectedListId: Id<"lists"> | null;
  setSelectedListId: (id: Id<"lists">) => void;
  listName: string;
  setListName: (name: string) => void;
  handleListNameChange: (name: string) => void;
  handleCreateList: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onSettingsClick: () => void;
}

export function StatusBar({
  isDesktopSidebarOpen,
  setIsDesktopSidebarOpen,
  setIsMobileDrawerOpen,
  lists,
  selectedListId,
  setSelectedListId,
  listName,
  setListName,
  handleListNameChange,
  handleCreateList,
  viewMode,
  setViewMode,
  onSettingsClick,
}: StatusBarProps) {
  const { signOut } = useAuthActions();
  const { isSimpleMode } = useSettings();
  const selectedList = lists.find((list) => list.id === selectedListId);

  if (!selectedList) {
    return (
      <View className="w-full h-[10vh] p-3">
        <View className="rounded-b-2xl rounded-t-lg border-2">
          <View className="flex flex-row px-3 py-1 items-center">
            <Text className="text-lg text-muted-foreground">no list selected.</Text>
          </View>
        </View>
      </View>
    );
  }

  const nodes = selectedList.nodes;
  const total = nodes.length || 1;
  const redCount = nodes.filter((n) => n.state === "red").length;
  const yellowCount = nodes.filter((n) => n.state === "yellow").length;
  const greenCount = nodes.filter((n) => n.state === "green").length;
  const redPct = (redCount / total) * 100;
  const yellowPct = (yellowCount / total) * 100;
  const greenPct = (greenCount / total) * 100;

  return (
    <View className={clsx("w-full h-[10vh] p-3 transition-all duration-300")}>
      <View className="rounded-b-2xl rounded-t-lg border-2">
        <View className="flex flex-row px-3 py-1 items-center">
          {!isSimpleMode && (
            <>
              <ButtonDotlists
                variant="ghost"
                size="icon"
                onPress={() => setIsMobileDrawerOpen(true)}
                className="mr-2 md:hidden"
              >
                <Menu className="h-5 w-5 text-foreground" />
              </ButtonDotlists>
              {!isDesktopSidebarOpen && (
                <ButtonDotlists
                  variant="ghost"
                  size="icon"
                  onPress={() => setIsDesktopSidebarOpen(true)}
                  className="mr-2 hidden md:block"
                >
                  <ChevronsRight className="h-5 w-5 text-foreground" />
                </ButtonDotlists>
              )}
            </>
          )}
          <Input
            className="w-full text-xl px-0 border-none bg-transparent font-heading text-foreground"
            value={listName}
            onChangeText={setListName}
            onBlur={() => handleListNameChange(listName)}
          />
          <View className="flex flex-row items-center">
            {!isSimpleMode && (
              <>
                <ButtonDotlists
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onPress={() => setViewMode("list")}
                >
                  <List className="h-5 w-5 text-foreground" />
                </ButtonDotlists>
                <ButtonDotlists
                  variant={viewMode === "gantt" ? "secondary" : "ghost"}
                  size="icon"
                  onPress={() => setViewMode("gantt")}
                >
                  <BarChart3 className="h-5 w-5 text-foreground" />
                </ButtonDotlists>
              </>
            )}
          </View>
          <Notifications />
          <ButtonDotlists variant="ghost" size="icon" onPress={onSettingsClick}>
            <SettingsIcon className="h-5 w-5 text-foreground" />
          </ButtonDotlists>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <ButtonDotlists
                variant="ghost"
                size="icon"
              >
                <ChevronDown className="w-5 text-foreground" />
              </ButtonDotlists>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-3 rounded-lg">
              {isSimpleMode && (
                <>
                  {lists.map((list) => (
                    <DropdownMenuItem
                      key={list.id}
                      onSelect={() => {
                        setSelectedListId(list.id);
                        setListName(list.name);
                      }}
                    >
                      <Text className="text-foreground">{list.name}</Text>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleCreateList}>
                    <Text className="text-foreground">create new list</Text>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem key="log-out" onSelect={signOut}>
                <Text className="text-foreground">log out</Text>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </View>
        <View className="flex flex-row h-2 w-full rounded-b-2xl overflow-hidden">
          <View
            className="transition-all duration-100"
            style={{
              width: `${redPct}%`,
              backgroundColor: redCount > 0 ? "#ef4444" : "transparent",
            }}
          />
          <View
            className="transition-all duration-100"
            style={{
              width: `${yellowPct}%`,
              backgroundColor: yellowCount > 0 ? "#fde047" : "transparent",
            }}
          />
          <View
            className="transition-all duration-100"
            style={{
              width: `${greenPct}%`,
              backgroundColor: greenCount > 0 ? "#22c55e" : "transparent",
            }}
          />
        </View>
      </View>
    </View>
  );
}


