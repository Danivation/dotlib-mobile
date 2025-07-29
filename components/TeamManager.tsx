import type { Doc } from "@/lib/convex";
import { api } from "@/lib/convex";
import { useMutation } from "convex/react";
import { Trash2 } from "lucide-react-native";
import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import "../app/global.css";
import { TeamMember } from "./TeamMember";
import { ButtonDotlists } from "./ui/button";
import { Input } from "./ui/input";

interface TeamManagerProps {
  teams: (Doc<"teams"> & { role: string })[];
  teamLists: Doc<"lists">[];
  handleCreateList: (teamId: Doc<"teams">["_id"]) => void;
  handleDeleteList: (listId: Doc<"lists">["_id"]) => void;
  setSelectedListId: (listId: Doc<"lists">["_id"]) => void;
  setListName: (name: string) => void;
  selectedListId: Doc<"lists">["_id"] | null;
}

export function TeamManager({
  teams,
  teamLists,
  handleCreateList,
  handleDeleteList,
  setSelectedListId,
  setListName,
  selectedListId,
}: TeamManagerProps) {
  const createTeam = useMutation(api.teams.createTeam);
  const deleteTeam = useMutation(api.teams.deleteTeam);
  const sendInvitation = useMutation(api.teams.sendInvitation);
  const [newTeamName, setNewTeamName] = useState("");
  const [inviteeUsername, setInviteeUsername] = useState("");
  const [selectedTeamForInvite, setSelectedTeamForInvite] = useState<
    Doc<"teams">["_id"] | null
  >(null);

  const handleCreateTeam = async () => {
    if (newTeamName.trim() !== "") {
      await createTeam({ name: newTeamName.trim() });
      setNewTeamName("");
    }
  };

  const handleDeleteTeam = async (teamId: Doc<"teams">["_id"]) => {
    await deleteTeam({ teamId });
  };

  const handleSendInvitation = async (teamId: Doc<"teams">["_id"]) => {
    if (inviteeUsername.trim() !== "") {
      try {
        await sendInvitation({
          teamId,
          inviteeUsername: inviteeUsername.trim(),
        });
        setInviteeUsername("");
        setSelectedTeamForInvite(null);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <View>
      <Text className="text-xl font-bold mb-4 font-heading">teams</Text>
      {teams.map((team) =>
        team ? (
          <View key={team._id} className="mb-4">
            <View className="flex flex-row items-center justify-between">
              <Text className="font-bold font-heading">{team.name}</Text>
              {team.role === "admin" && (
                <ButtonDotlists
                  variant="ghost"
                  size="icon"
                  onPress={() => handleDeleteTeam(team._id)}
                  className="h-6 w-6"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </ButtonDotlists>
              )}
            </View>
            <TeamMember team={team} viewerRole={team.role} />
            <View>
              {teamLists
                .filter((list) => list.teamId === team._id)
                .map((list) => (
                  <TouchableOpacity
                    key={list._id}
                    className={`flex flex-row items-center justify-between p-2 rounded ${
                      selectedListId === list._id
                        ? "bg-muted/50"
                        : ""
                    }`}
                    onPress={() => {
                      setSelectedListId(list._id);
                      setListName(list.name);
                    }}
                  >
                    <Text className={selectedListId === list._id ? "text-muted-foreground" : "text-foreground"}>{list.name}</Text>
                    {team.role === "admin" && (
                      <ButtonDotlists
                        variant="ghost"
                        size="icon"
                        onPress={(e) => {
                          e.stopPropagation();
                          handleDeleteList(list._id);
                        }}
                        className="h-6 w-6"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </ButtonDotlists>
                    )}
                  </TouchableOpacity>
                ))}
            </View>
            <ButtonDotlists
              variant="ghost"
              size="sm"
              onPress={() => handleCreateList(team._id)}
              className="mt-1"
            >
              <Text>+ new team list</Text>
            </ButtonDotlists>
            {team.role === "admin" && (
              <View className="mt-2">
                <Input
                  value={
                    selectedTeamForInvite === team._id ? inviteeUsername : ""
                  }
                  onChangeText={(text) => {
                    setSelectedTeamForInvite(team._id);
                    setInviteeUsername(text);
                  }}
                  placeholder="invite user..."
                  className="h-8"
                />
                <ButtonDotlists
                  onPress={() => handleSendInvitation(team._id)}
                  size="sm"
                  className="mt-1"
                >
                  <Text>invite</Text>
                </ButtonDotlists>
              </View>
            )}
          </View>
        ) : null,
      )}
      <View className="mt-4 pt-4 border-t">
        <Input
          value={newTeamName}
          onChangeText={setNewTeamName}
          placeholder="new team name..."
          className="mb-2"
        />
        <ButtonDotlists onPress={handleCreateTeam} size="sm">
          <Text>create team</Text>
        </ButtonDotlists>
      </View>
    </View>
  );
}

