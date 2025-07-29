import { CreateUsername } from "@/components/CreateUsername";
import { GanttView } from "@/components/GanttView";
import { ListEditor } from "@/components/ListEditor";
import { Settings } from "@/components/Settings";
import { StatusBar } from "@/components/StatusBar";
import { TeamManager } from "@/components/TeamManager";
import { useSettings } from "@/contexts/SettingsContext";
import clsx from "clsx";
import { useMutation, useQuery } from "convex/react";
import { ChevronsLeft, Trash2 } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Text, TouchableOpacity, View, Modal } from "react-native";
import "./global.css";

import { ButtonDotlists } from "@/components/ui/button";
import { api, type Doc, type Id } from "@/lib/convex";

type ConvexItem = Doc<"items"> & { uuid: Id<"items"> };

type ConvexList = Doc<"lists"> & {
  id: Id<"lists">;
  nodes: ConvexItem[];
};

type ViewMode = "list" | "gantt";

export default function AuthenticatedApp() {
  const { isSimpleMode } = useSettings();
  const userProfile = useQuery(api.main.getMyUserProfile);
  const rawLists = useQuery(api.lists.getLists);
  const teams = useQuery(api.teams.getTeams);

  const createList = useMutation(api.lists.createListPublic);
  const updateList = useMutation(api.lists.updateList);
  const deleteList = useMutation(api.lists.deleteListPublic);
  const createItem = useMutation(api.lists.createItemPublic);
  const updateItem = useMutation(api.lists.updateItem);
  const deleteItem = useMutation(api.lists.deleteItemPublic);

  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(!isSimpleMode);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const lists: ConvexList[] = useMemo(
    () =>
      rawLists?.map((list) => ({
        ...list,
        id: list._id,
        nodes:
          list.nodes?.map((node) => ({
            ...node,
            uuid: node._id,
          })) ?? [],
      })) ?? [],
    [rawLists],
  );

  const personalLists = lists.filter((list) => !list.teamId);
  const teamLists = lists.filter((list) => list.teamId);

  const [selectedListId, setSelectedListId] = useState<Id<"lists"> | null>(
    null,
  );
  const [listName, setListName] = useState<string>("");
  const [focusedItemId, setFocusedItemId] = useState<Id<"items"> | null>(null);

  const selectedList = lists.find(
    (list: ConvexList) => list.id === selectedListId,
  );

  const handleListNameChange = (name: string) => {
    if (selectedListId && name) {
      updateList({ id: selectedListId, name });
    }
  };

  const handleCreateList = useCallback(async (teamId?: Id<"teams">) => {
    const result = await createList({ name: "New List", teamId });
    if (result) {
      setSelectedListId(result);
      setListName("New List");
      setIsMobileDrawerOpen(false);
    }
  }, [createList]);

  useEffect(() => {
    if (lists.length > 0 && (!selectedListId || !lists.some(list => list.id === selectedListId))) {
      setSelectedListId(lists[0].id);
      setListName(lists[0].name);
    }
  }, [lists, selectedListId]);

  const handleAddItem = useCallback(async (
    text: string,
    state: "red" | "yellow" | "green" = "red",
  ) => {
    if (selectedListId) {
      const newItemId = await createItem({ listId: selectedListId, text, state });
      setFocusedItemId(newItemId);
    }
  }, [createItem, selectedListId]);

  const handleUpdateItem = async (
    id: Id<"items">,
    updates: Partial<Doc<"items">>,
  ) => {
    await updateItem({ id, ...updates });
  };

  const handleDeleteItem = async (id: Id<"items">) => {
    await deleteItem({ id });
  };

  const handleDeleteList = async (id: Id<"lists">) => {
    await deleteList({ id });
    if (selectedListId === id) {
      const newSelectedList = lists.find((l) => l.id !== id);
      if (newSelectedList) {
        setSelectedListId(newSelectedList.id);
        setListName(newSelectedList.name);
      } else {
        setSelectedListId(null);
        setListName("");
      }
    }
  };

  if (
    userProfile === undefined ||
    rawLists === undefined ||
    teams === undefined
  ) {
    return <Text className="flex items-center justify-center h-screen">Loading...</Text>;
  }

  if (userProfile === null) {
    return <CreateUsername />;
  }

  if (lists.length === 0) {
    return (
      <View className="flex flex-col items-center justify-center h-screen">
        <Text className="text-4xl font-bold mb-8">no lists yet!</Text>
        <ButtonDotlists onPress={() => handleCreateList()}>
          <Text>create a new list</Text>
        </ButtonDotlists>
      </View>
    );
  }

  const validTeams = teams?.filter(Boolean) as (Doc<"teams"> & { role: string })[] | undefined;

  const sidebarContent = (
    <>
      <View className="flex flex-row items-center justify-between mb-4">
        <Text className="text-xl font-bold font-heading">personal lists</Text>
        <ButtonDotlists
          variant="ghost"
          size="icon"
          onPress={() => isMobileDrawerOpen ? setIsMobileDrawerOpen(false) : setIsDesktopSidebarOpen(false)}
        >
          <ChevronsLeft className="h-5 w-5 text-foreground" />
        </ButtonDotlists>
      </View>
      <FlatList
        data={personalLists}
        keyExtractor={list => list.id}
        renderItem = {({item: list}) => (
          <TouchableOpacity
            className={`flex flex-row items-center justify-between p-2 rounded ${
              selectedListId === list.id
                ? "bg-muted/50"
                : ""
            }`}
            onPress={() => {
              setSelectedListId(list.id);
              setListName(list.name);
              setIsMobileDrawerOpen(false);
            }}
          >
            <Text className={selectedListId === list.id ? "text-muted-foreground" : "text-foreground"}>{list.name}</Text>
            <ButtonDotlists
              variant="ghost"
              size="icon"
              onPress={(e) => {
                e.stopPropagation();
                handleDeleteList(list.id);
              }}
              className="h-6 w-6"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </ButtonDotlists>
          </TouchableOpacity>
        )}
      />
      <ButtonDotlists variant="ghost" size="sm" onPress={() => handleCreateList()} className="mt-1">
        <Text>+ new personal list <Text className="ml-2 text-xs text-muted-foreground">(ctrl+shift+l)</Text></Text>
      </ButtonDotlists>
      {!isSimpleMode && (
        <>
          <View className="my-4 h-px bg-border" />
          {validTeams && (
            <TeamManager
              teams={validTeams}
              teamLists={teamLists}
              handleCreateList={handleCreateList}
              handleDeleteList={handleDeleteList}
              setSelectedListId={(id) => {
                setSelectedListId(id);
                setIsMobileDrawerOpen(false);
              }}
              setListName={setListName}
              selectedListId={selectedListId}
            />
          )}
        </>
      )}
    </>
  );

  return (
    <>
      <View className="relative md:flex-row h-screen bg-background text-foreground">
        {/* Mobile Drawer */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isMobileDrawerOpen}
          onRequestClose={() => {
            setIsMobileDrawerOpen(!isMobileDrawerOpen);
          }}
        >
            <View className="flex-1 flex-row">
                <View className="w-3/4 h-full bg-background p-4 border-r border-border">
                    {sidebarContent}
                </View>
                <TouchableOpacity className="w-1/4 h-full" onPress={() => setIsMobileDrawerOpen(false)} />
            </View>
        </Modal>

        {/* Desktop Sidebar */}
        {isDesktopSidebarOpen && (
            <View
            className={clsx(
                "hidden md:block border-r border-border h-full overflow-y-auto transition-all duration-300",
                {
                "w-1/4 p-4": isDesktopSidebarOpen,
                "w-0 p-0 border-0": !isDesktopSidebarOpen,
                },
            )}
            >
            {sidebarContent}
            </View>
        )}

        {/* Main Content */}
        <View
          className={clsx(
            "flex flex-col w-full h-full transition-all duration-300",
            {
              "md:w-3/4": isDesktopSidebarOpen,
              "md:w-full": !isDesktopSidebarOpen,
            },
          )}
        >
          <StatusBar
            isDesktopSidebarOpen={isDesktopSidebarOpen}
            setIsDesktopSidebarOpen={setIsDesktopSidebarOpen}
            setIsMobileDrawerOpen={setIsMobileDrawerOpen}
            lists={lists}
            selectedListId={selectedListId}
            setSelectedListId={setSelectedListId}
            listName={listName}
            setListName={setListName}
            handleListNameChange={handleListNameChange}
            handleCreateList={() => handleCreateList()}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onSettingsClick={() => setIsSettingsOpen(true)}
          />
          <View className="flex-grow overflow-y-auto px-4 mt-16">
            {selectedList && (viewMode === "list" || isSimpleMode) && (
              <ListEditor
                state={selectedList}
                handleUpdateItem={handleUpdateItem}
                handleAddItem={handleAddItem}
                handleDeleteItem={handleDeleteItem}
                focusedItemId={focusedItemId}
                setFocusedItemId={setFocusedItemId}
              />
            )}
            {selectedListId && viewMode === "gantt" && !isSimpleMode && (
              <GanttView listId={selectedListId} />
            )}
          </View>
        </View>
      </View>
      <Settings
        isOpen={isSettingsOpen}
        onClose={() => {
          console.log("onClose called");
          setIsSettingsOpen(false);
        }}
      />
    </>
  );
}