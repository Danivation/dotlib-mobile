// src/components/Notifications.tsx
import { api } from "@/lib/convex";
import { useMutation, useQuery } from "convex/react";
import { Bell } from "lucide-react-native";
import { View, Text } from "react-native";
import "../app/global.css";
import { ButtonDotlists } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Notifications() {
  const data = useQuery(api.notifications.getNotifications);
  const markAsRead = useMutation(api.notifications.markAsRead);
  const acceptInvitation = useMutation(api.teams.acceptInvitation);
  const declineInvitation = useMutation(api.teams.declineInvitation);

  const notifications = data?.notifications ?? [];
  const invitations = data?.invitations ?? [];
  const unreadCount = notifications.length + invitations.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <View className="relative">
          <Bell className="h-5 w-5 text-foreground" />
          {unreadCount > 0 && (
            <View className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500" />
          )}
        </View>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        {unreadCount === 0 && (
          <DropdownMenuItem disabled>
            <Text className="text-muted-foreground">no new notifications</Text>
          </DropdownMenuItem>
        )}
        {notifications.map((n) => (
          <DropdownMenuItem
            key={n._id}
            onSelect={() => markAsRead({ notificationId: n._id })}
          >
            <View className="text-sm">
              <Text className="text-foreground">
                <Text className="font-semibold">{n.actorName}</Text>
                {n.type === "assignment" && " assigned a task to you."}
                {n.type === "comment" && " commented on a task."}
              </Text>
            </View>
          </DropdownMenuItem>
        ))}
        {invitations.length > 0 && notifications.length > 0 && <DropdownMenuSeparator />}
        {invitations.map((inv) => (
          <View key={inv._id} className="p-2 text-sm">
            <Text className="text-foreground">
              <Text className="font-semibold">{inv.inviterName}</Text> invited you to join{" "}
              <Text className="font-semibold">{inv.teamName}</Text>.
            </Text>
            <View className="flex flex-row justify-end gap-2 mt-2">
              <ButtonDotlists
                size="sm"
                variant="outline"
                onPress={() => declineInvitation({ invitationId: inv._id })}
              >
                <Text>decline</Text>
              </ButtonDotlists>
              <ButtonDotlists
                size="sm"
                onPress={() => acceptInvitation({ invitationId: inv._id })}
              >
                <Text>accept</Text>
              </ButtonDotlists>
            </View>
          </View>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}