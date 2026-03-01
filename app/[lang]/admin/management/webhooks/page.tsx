"use client";

import { useWebhooks } from "@/components/ui/hooks/use-webhooks";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/shadcn/badge";
import { Button } from "@/components/ui/shadcn/button";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/shadcn/dialog";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import type { Webhook } from "@/lib/api/admin-webhook";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";
import {
  useCreateWebhook,
  useDeleteWebhook,
  useToggleWebhook,
} from "@/lib/query/mutations";
import { Plus, Power, Trash2, WebhookIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function WebhooksManagementPage() {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const t = dict.admin.webhooks;
  const { webhooks, loading, refetch } = useWebhooks();
  const createWebhook = useCreateWebhook();
  const toggleWebhook = useToggleWebhook();
  const deleteWebhook = useDeleteWebhook();

  const [createOpen, setCreateOpen] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Webhook | null>(null);

  const handleCreate = useCallback(async () => {
    if (!newUrl.trim()) {
      toast.error("Please enter a webhook URL");
      return;
    }
    try {
      await createWebhook.mutateAsync({
        url: newUrl.trim(),
        isActive: true,
      });
      setCreateOpen(false);
      setNewUrl("");
      refetch();
    } catch {
      // Toast handled by mutation
    }
  }, [newUrl, createWebhook, refetch]);

  const handleToggle = useCallback(
    async (wh: Webhook) => {
      try {
        await toggleWebhook.mutateAsync(wh.id);
        refetch();
      } catch {
        // Toast handled by mutation
      }
    },
    [toggleWebhook, refetch],
  );

  const handleDelete = useCallback(
    async (wh: Webhook) => {
      try {
        await deleteWebhook.mutateAsync(wh.id);
        setDeleteTarget(null);
        refetch();
      } catch {
        // Toast handled by mutation
      }
    },
    [deleteWebhook, refetch],
  );

  const ownerLabel = (wh: Webhook) => {
    if (wh.student) {
      return wh.student.fullName || wh.student.studentId || "Student";
    }
    if (wh.lecturer) {
      return wh.lecturer.fullName || wh.lecturer.lecturerId || "Lecturer";
    }
    return dict.admin.common.na;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.title}
        description={t.description}
        action={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {dict.admin.common.create}
          </Button>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center p-12 text-muted-foreground">
          {t.loading}
        </div>
      ) : webhooks.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <WebhookIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{t.empty}</p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              {dict.admin.common.create}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {webhooks.map((wh) => (
            <Card key={wh.id}>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <code className="text-sm bg-muted px-2 py-1 rounded truncate max-w-full">
                        {wh.url}
                      </code>
                      <Badge variant={wh.isActive ? "default" : "secondary"}>
                        {wh.isActive ? t.active : t.inactive}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t.owner}: {ownerLabel(wh)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t.createdAt}:{" "}
                      {new Date(wh.createdAt).toLocaleString(
                        locale === "vi" ? "vi-VN" : "en-US",
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggle(wh)}
                      disabled={toggleWebhook.isPending}
                    >
                      <Power className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteTarget(wh)}
                      disabled={deleteWebhook.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dict.admin.common.create} Webhook</DialogTitle>
            <DialogDescription>
              Create a webhook to receive notifications when events occur. You
              can optionally associate it with a student or lecturer via the
              API.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="webhook-url">{t.url}</Label>
              <Input
                id="webhook-url"
                placeholder="https://example.com/webhook"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              {dict.admin.common.cancel}
            </Button>
            <Button
              onClick={handleCreate}
              disabled={createWebhook.isPending || !newUrl.trim()}
            >
              {createWebhook.isPending
                ? "Creating..."
                : dict.admin.common.create}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dict.admin.common.confirmTitle}</DialogTitle>
            <DialogDescription>
              {dict.admin.common.confirmDeleteBody?.replace(
                "{entity}",
                "this webhook",
              ) ?? "This will permanently delete this webhook."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              {dict.admin.common.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
              disabled={deleteWebhook.isPending}
            >
              {dict.admin.common.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
