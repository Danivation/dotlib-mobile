// src/components/CommentSection.tsx
import type { Id } from "@/lib/convex";
import { api } from "@/lib/convex";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { View, Text } from "react-native";
import "../app/global.css";
import { ButtonDotlists } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface CommentSectionProps {
  itemId: Id<"items">;
}

export function CommentSection({ itemId }: CommentSectionProps) {
  const comments = useQuery(api.comments.getComments, { itemId });
  const addComment = useMutation(api.comments.addComment);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim() !== "") {
      addComment({ itemId, text: newComment.trim() });
      setNewComment("");
    }
  };

  return (
    <View className="mt-4 p-4 bg-gray-50 rounded-lg">
      <Text className="font-bold mb-2 text-black">comments</Text>
      <View className="space-y-2">
        {comments?.map((comment) => (
          <View key={comment._id} className="text-sm">
            <Text className="text-black">
              <Text className="font-semibold">{comment.author}: </Text>
              <Text>{comment.text}</Text>
            </Text>
          </View>
        ))}
      </View>
      <View className="mt-4 flex flex-row gap-2">
        <Textarea
          value={newComment}
          onChangeText={setNewComment}
          placeholder="add a comment..."
          className="text-sm flex-1"
        />
        <ButtonDotlists onPress={handleAddComment} size="sm">
          <Text>send</Text>
        </ButtonDotlists>
      </View>
    </View>
  );
}