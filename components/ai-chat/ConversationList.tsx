"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/shadcn/alert-dialog";
import { Button } from "@/components/ui/shadcn/button";
import { aiChatApi } from "@/lib/api/ai-chat";
import { getClientDictionary, useLocale, useLocalePath } from "@/lib/i18n";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquarePlus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const QUERY_KEY = ["ai-chat", "conversations"];

export function ConversationList() {
  const params = useParams();
  // const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const localePath = useLocalePath();
  const dict = getClientDictionary(locale);
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const conversationId = params?.id as string | undefined;

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => aiChatApi.listConversations(),
  });

  const handleDelete = async (id: string) => {
    try {
      await aiChatApi.deleteConversation(id);
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      if (conversationId === id) {
        router.push(localePath("/ai-chat"));
      }
      toast.success(dict.aiChat?.deleted ?? "Conversation deleted");
    } catch (err) {
      toast.error(
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : (dict.common?.error ?? "Failed to delete"),
      );
    } finally {
      setDeletingId(null);
    }
  };

  const canCreate = conversations.length < 5;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">
          {dict.aiChat?.conversations ?? "Conversations"}
        </h2>
        {canCreate && (
          <Button variant="ghost" size="sm" className="h-8 gap-1" asChild>
            <Link href={localePath("/ai-chat")}>
              <MessageSquarePlus className="h-4 w-4" />
              {dict.aiChat?.new ?? "New"}
            </Link>
          </Button>
        )}
      </div>

      {!canCreate && (
        <p className="text-xs text-muted-foreground">
          {dict.aiChat?.maxConversations ??
            "Max 5 conversations. Delete one to create a new one."}
        </p>
      )}

      {isLoading ? (
        <div className="animate-pulse space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 rounded-md bg-muted" />
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">
          {dict.aiChat?.noConversations ??
            "No conversations yet. Use a preset below to start."}
        </p>
      ) : (
        <ul className="space-y-1">
          {conversations.map((conv) => (
            <li key={conv.id}>
              <div
                className={`group flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                  conversationId === conv.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                <Link
                  href={localePath(`/ai-chat/${conv.id}`)}
                  className="flex-1 min-w-0 truncate"
                >
                  {conv.title}
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 opacity-70 hover:opacity-100"
                  onClick={() => setDeletingId(conv.id)}
                  aria-label="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dict.aiChat?.deleteTitle ?? "Delete conversation?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dict.aiChat?.deleteDescription ??
                "This will permanently delete this conversation and all messages."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {dict.common?.cancel ?? "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && handleDelete(deletingId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {dict.common?.delete ?? "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
