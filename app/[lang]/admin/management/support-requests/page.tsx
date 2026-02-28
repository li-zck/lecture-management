"use client";

import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { adminRequestApi } from "@/lib/api/admin-request";
import type { SupportRequestItem } from "@/lib/api/support-request";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";
import { HeadphonesIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function SupportRequestsPage() {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const t = dict.admin.supportRequests;
  const s = dict.support;
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<SupportRequestItem[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminRequestApi.getSupportRequests();
      setRequests(data);
    } catch {
      toast.error(t.loadFailed);
    } finally {
      setLoading(false);
    }
  }, [t.loadFailed]);

  useEffect(() => {
    load();
  }, [load]);

  const roleLabel = (role: string) =>
    (s.roles as Record<string, string> | undefined)?.[role] ?? role;
  const categoryLabel = (cat: string) =>
    (s.categories as Record<string, string> | undefined)?.[cat] ?? cat;

  return (
    <div className="space-y-6">
      <PageHeader title={t.title} description={t.description} />
      {loading ? (
        <div className="flex items-center justify-center p-12 text-muted-foreground">
          {t.loading}
        </div>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <HeadphonesIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{t.empty}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <Card key={req.id}>
              <CardContent className="p-4">
                <div className="grid gap-2 text-sm">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="font-medium">{req.name}</span>
                    <span className="text-muted-foreground">{req.email}</span>
                    <span className="capitalize">{roleLabel(req.role)}</span>
                    <span className="text-muted-foreground">
                      {new Date(req.createdAt).toLocaleString(
                        locale === "vi" ? "vi-VN" : "en-US",
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t.category}:</span>{" "}
                    {categoryLabel(req.category)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t.subject}:</span>{" "}
                    {req.subject}
                  </div>
                  <div className="pt-2 border-t">
                    <span className="text-muted-foreground">{t.message}:</span>
                    <p className="mt-1 whitespace-pre-wrap">{req.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
