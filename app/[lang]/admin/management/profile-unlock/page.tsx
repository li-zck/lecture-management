"use client";

import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { adminRequestApi } from "@/lib/api/admin-request";
import { getErrorInfo } from "@/lib/api/error";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";
import { KeyRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ProfileUnlockPage() {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const t = dict.admin.profileUnlock;
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<"student" | "lecturer">("student");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUnlock = async () => {
    const id = userId.trim();
    if (!id) {
      toast.error(t.userIdPlaceholder);
      return;
    }
    setIsSubmitting(true);
    try {
      await adminRequestApi.unlockProfileChangeCooldown(id, role);
      toast.success(t.unlockSuccess);
      setUserId("");
    } catch (err: unknown) {
      const info = getErrorInfo(err);
      if (info.status === 404) {
        toast.error(t.userNotFound);
      } else {
        toast.error(info.message || t.unlockFailed);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title={t.title} description={t.description} />
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            {t.title}
          </CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userId">{t.userIdLabel}</Label>
            <Input
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder={t.userIdPlaceholder}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label>{t.roleLabel}</Label>
            <Select
              value={role}
              onValueChange={(v) => setRole(v as "student" | "lecturer")}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">{t.student}</SelectItem>
                <SelectItem value="lecturer">{t.lecturer}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleUnlock}
            disabled={isSubmitting || !userId.trim()}
          >
            {isSubmitting ? t.unlocking : t.unlockButton}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
