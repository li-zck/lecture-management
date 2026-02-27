"use client";

import { useSession } from "@/components/provider/SessionProvider";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn";
import { studentApi } from "@/lib/api/student";
import { getClientDictionary, useLocale, useLocalePath } from "@/lib/i18n";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

interface RejectedPageProps {
  params: Promise<{ requestId: string }>;
}

export default function WithdrawalRejectedPage({ params }: RejectedPageProps) {
  const { requestId } = use(params);
  const { isAuthenticated, role } = useSession();
  const locale = useLocale();
  const localePath = useLocalePath();
  const dict = getClientDictionary(locale);
  const t = dict.withdrawalRequest;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [request, setRequest] = useState<Awaited<
    ReturnType<typeof studentApi.getWithdrawalRequestById>
  > | null>(null);

  useEffect(() => {
    if (!isAuthenticated || role !== "student") {
      router.replace(localePath("dashboard"));
      return;
    }

    const fetch = async () => {
      try {
        const data = await studentApi.getWithdrawalRequestById(requestId);
        setRequest(data);
      } catch (err) {
        console.error("Failed to load withdrawal request", err);
        setError(dict.common.error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [isAuthenticated, role, requestId, router, localePath, dict.common.error]);

  if (!isAuthenticated || role !== "student") {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <CardTitle>{dict.common.error}</CardTitle>
            <CardDescription>{error ?? dict.common.error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push(localePath("my-courses"))}>
              {t.backToMyCourses}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Card className="border-destructive/40">
          <CardHeader className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">
                {dict.notifications?.title ?? "Notification"}
              </span>
            </div>
            <CardTitle>Course Withdrawal Declined</CardTitle>
            <CardDescription>
              {t.formTitle}: {request.enrollment.courseOnSemester.course.name} •{" "}
              {request.enrollment.courseOnSemester.semester.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t.reasonLabel}
              </p>
              <p className="mt-1 text-sm">
                {request.rejectionReason ??
                  "Your withdrawal request was declined by the administration."}
              </p>
            </div>
            {request.details && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t.detailsLabel}
                </p>
                <p className="mt-1 text-sm">{request.details}</p>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => router.push(localePath("support"))}
              >
                {dict.settings.contactSupport}
              </Button>
              <Button onClick={() => router.push(localePath("my-courses"))}>
                {t.backToMyCourses}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
