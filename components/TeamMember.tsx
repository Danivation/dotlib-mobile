// src/components/TeamMember.tsx
import type { Doc } from "@/lib/convex";
import { api } from "@/lib/convex";
import { useMutation, useQuery } from "convex/react";
import { View, Text } from "react-native";
import "../app/global.css";
import { ButtonDotlists } from "./ui/button";

interface TeamMemberProps {
  team: Doc<"teams">;
  viewerRole: string;
}

export function TeamMember({ team, viewerRole }: TeamMemberProps) {
  const members = useQuery(api.teams.getTeamMembers, { teamId: team._id });
  const removeMember = useMutation(api.teams.removeMemberFromTeam);

  const handleRemoveMember = (memberId: string) => {
    removeMember({ teamId: team._id, memberId });
  };

  return (
    <View className="pl-4 mt-2 space-y-1">
      {members?.map((member) => (
        <View key={member._id} className="flex flex-row items-center justify-between">
          <Text className="text-sm text-foreground">
            {member.username} ({member.role})
          </Text>
          {viewerRole === "admin" && member.userId !== team.ownerId && (
            <ButtonDotlists
              variant="ghost"
              size="sm"
              className="h-6"
              onPress={() => handleRemoveMember(member.userId)}
            >
              <Text>remove</Text>
            </ButtonDotlists>
          )}
        </View>
      ))}
    </View>
  );
}
