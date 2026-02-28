"use client";

import { Button } from "@/components/ui/shadcn/button";
import { aiChatApi, type AiMessage } from "@/lib/api/ai-chat";
import { getClientDictionary, useLocale } from "@/lib/i18n";
import { useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

interface ChatWindowProps {
  conversationId: string;
  messages: AiMessage[];
}

export function ChatWindow({ conversationId, messages }: ChatWindowProps) {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const queryClient = useQueryClient();
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [pendingUserMessage, setPendingUserMessage] = useState<string | null>(
    null,
  );
  const [waitingForReply, setWaitingForReply] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Build optimistic view of messages: server messages + local pending + AI typing
  const displayMessages: Array<
    AiMessage & { id: string; role: "user" | "model" }
  > = [...messages];

  if (pendingUserMessage) {
    displayMessages.push({
      id: "local-user",
      conversationId,
      role: "user",
      content: pendingUserMessage,
      createdAt: new Date().toISOString(),
    } as AiMessage & { id: string; role: "user" | "model" });
  }

  if (waitingForReply) {
    displayMessages.push({
      id: "local-assistant",
      conversationId,
      role: "model",
      content: "…",
      createdAt: new Date().toISOString(),
    } as AiMessage & { id: string; role: "user" | "model" });
  }

  const handleSend = async () => {
    const content = input.trim();
    if (!content || sending) return;

    setSending(true);
    setPendingUserMessage(content);
    setWaitingForReply(true);
    setInput("");

    try {
      await aiChatApi.sendMessage(conversationId, content);
      queryClient.invalidateQueries({
        queryKey: ["ai-chat", "conversation", conversationId],
      });
      queryClient.invalidateQueries({ queryKey: ["ai-chat", "conversations"] });
      // New messages will come from server; clear local pending state.
      setPendingUserMessage(null);
      setWaitingForReply(false);
    } catch (err) {
      toast.error(
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : (dict.common?.error ?? "Failed to send"),
      );
      // Restore input, clear optimistic bubbles.
      setInput(content);
      setPendingUserMessage(null);
      setWaitingForReply(false);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] border rounded-lg bg-muted/30">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {displayMessages.map((m, idx) => (
          <div
            key={`${m.id}-${idx}`}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-4 py-2 ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background border"
              }`}
            >
              {m.role === "model" ? (
                <div className="prose prose-sm dark:prose-invert max-w-none [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:my-1 [&_strong]:font-semibold [&_p]:my-2 first:[&_p]:mt-0 last:[&_p]:mb-0">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{m.content}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
      <div className="p-4 border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder={
            dict.aiChat?.placeholder ??
            "Ask about your courses, schedule, grades..."
          }
          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
          disabled={sending}
        />
        <Button
          onClick={handleSend}
          disabled={sending || !input.trim()}
          size="icon"
          className="shrink-0"
        >
          {sending ? (
            <span className="animate-pulse">…</span>
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
