"use client";

import { ChatWindow } from "@/components/ai-chat/ChatWindow";
import { aiChatApi } from "@/lib/api/ai-chat";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function AIChatConversationPage() {
  const params = useParams();
  const id = params?.id as string;

  const {
    data: conversation,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ai-chat", "conversation", id],
    queryFn: () => aiChatApi.getConversation(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] rounded-lg border bg-muted/20 p-8 text-center">
        <p className="text-destructive">
          {error && typeof error === "object" && "message" in error
            ? String((error as { message: string }).message)
            : "Conversation not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{conversation.title}</h2>
      <ChatWindow
        conversationId={conversation.id}
        messages={conversation.messages}
      />
    </div>
  );
}
