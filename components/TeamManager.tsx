import type { Doc } from "@/lib/convex";
import { api } from "@/lib/convex";
import { useMutation } from "convex/react";
import { Trash2 } from "lucide-react";
import { useState } from "react";
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
    <div>
      <h2 className="text-xl font-bold mb-4 font-heading">teams</h2>
      {teams.map((team) =>
        team ? (
          <div key={team._id} className="mb-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold font-heading">{team.name}</h3>
              {team.role === "admin" && (
                <ButtonDotlists
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteTeam(team._id)}
                  className="h-6 w-6"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </ButtonDotlists>
              )}
            </div>
            <TeamMember team={team} viewerRole={team.role} />
            <ul>
              {teamLists
                .filter((list) => list.teamId === team._id)
                .map((list) => (
                  <li
                    key={list._id}
                    className={`flex items-center justify-between cursor-pointer p-2 rounded ${
                      selectedListId === list._id
                        ? "bg-muted/50 text-muted-foreground"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedListId(list._id);
                      setListName(list.name);
                    }}
                  >
                    <span>{list.name}</span>
                    {team.role === "admin" && (
                      <ButtonDotlists
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteList(list._id);
                        }}
                        className="h-6 w-6"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </ButtonDotlists>
                    )}
                  </li>
                ))}
            </ul>
            <ButtonDotlists
              variant="ghost"
              size="sm"
              onClick={() => handleCreateList(team._id)}
              className="mt-1"
            >
              + new team list
            </ButtonDotlists>
            {team.role === "admin" && (
              <div className="mt-2">
                <Input
                  value={
                    selectedTeamForInvite === team._id ? inviteeUsername : ""
                  }
                  onChange={(e) => {
                    setSelectedTeamForInvite(team._id);
                    setInviteeUsername(e.target.value);
                  }}
                  placeholder="invite user..."
                  className="h-8"
                />
                <ButtonDotlists
                  onClick={() => handleSendInvitation(team._id)}
                  size="sm"
                  className="mt-1"
                >
                  invite
                </ButtonDotlists>
              </div>
            )}
          </div>
        ) : null,
      )}
      <div className="mt-4 pt-4 border-t">
        <Input
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          placeholder="new team name..."
          className="mb-2"
        />
        <ButtonDotlists onClick={handleCreateTeam} size="sm">
          create team
        </ButtonDotlists>
      </div>
    </div>
  );
}

