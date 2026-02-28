"use client";

import { Button } from "@/components/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { Checkbox } from "@/components/ui/shadcn/checkbox";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import type { UserWebhook } from "@/lib/api/user-webhook";
import { getClientDictionary, isLocale } from "@/lib/i18n";
import {
  useCreateLecturerWebhook,
  useCreateStudentWebhook,
  useDeleteLecturerWebhook,
  useDeleteStudentWebhook,
  useToggleLecturerWebhook,
  useToggleStudentWebhook,
} from "@/lib/query/mutations";
import { Link2, Loader2, Plus, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

interface SettingsWebhooksSectionProps {
  role: "student" | "lecturer";
  webhooks: UserWebhook[];
  loading: boolean;
  refetch: () => void;
}

export function SettingsWebhooksSection({
  role,
  webhooks,
  loading,
  refetch,
}: SettingsWebhooksSectionProps) {
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const locale = isLocale(lang) ? lang : "en";
  const dict = getClientDictionary(locale);
  const st = dict.settings;

  const [newUrl, setNewUrl] = useState("");

  const createStudent = useCreateStudentWebhook();
  const createLecturer = useCreateLecturerWebhook();
  const toggleStudent = useToggleStudentWebhook();
  const toggleLecturer = useToggleLecturerWebhook();
  const deleteStudent = useDeleteStudentWebhook();
  const deleteLecturer = useDeleteLecturerWebhook();

  const createWebhook = role === "student" ? createStudent : createLecturer;
  const toggleWebhook = role === "student" ? toggleStudent : toggleLecturer;
  const deleteWebhook = role === "student" ? deleteStudent : deleteLecturer;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = newUrl.trim();
    if (!url) return;
    try {
      await createWebhook.mutateAsync({ url });
      setNewUrl("");
      refetch();
    } catch {
      // Error handled by mutation
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleWebhook.mutateAsync(id);
      refetch();
    } catch {
      // Error handled by mutation
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteWebhook.mutateAsync(id);
      refetch();
    } catch {
      // Error handled by mutation
    }
  };

  const isCreating = createWebhook.isPending;
  const isToggling = toggleWebhook.isPending;
  const isDeleting = deleteWebhook.isPending;

  return (
    <Card className="border-border/50 shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">{st.webhooks}</CardTitle>
        <CardDescription>{st.webhooksDesc}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new webhook */}
        <form
          onSubmit={handleCreate}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <div className="flex-1 space-y-2">
            <Label htmlFor="webhook-url" className="sr-only">
              {st.webhookUrl}
            </Label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="webhook-url"
                type="url"
                placeholder={st.webhookUrlPlaceholder}
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="pl-10"
                disabled={isCreating}
              />
            </div>
          </div>
          <Button type="submit" disabled={isCreating || !newUrl.trim()}>
            {isCreating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                {st.addWebhook}
              </>
            )}
          </Button>
        </form>

        {/* Webhook list */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : webhooks.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            {st.noWebhooks}
          </p>
        ) : (
          <ul className="space-y-3">
            {webhooks.map((wh) => (
              <li
                key={wh.id}
                className="flex items-center justify-between gap-4 p-3 rounded-lg border bg-muted/30"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{wh.url}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`webhook-toggle-${wh.id}`}
                      checked={wh.isActive}
                      onCheckedChange={() => handleToggle(wh.id)}
                      disabled={isToggling}
                      aria-label={wh.isActive ? st.active : st.inactive}
                    />
                    <span className="text-xs text-muted-foreground">
                      {wh.isActive ? st.active : st.inactive}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(wh.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
