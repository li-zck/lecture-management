"use client";

import { useSession } from "@/components/provider/SessionProvider";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/ui/shadcn";
import { studentApi, type EnrolledCourse } from "@/lib/api/student";
import { getClientDictionary, useLocale, useLocalePath } from "@/lib/i18n";
import { useRouter } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface WithdrawalPageProps {
  params: Promise<{ courseOnSemesterId: string }>;
}

export default function WithdrawalRequestPage({ params }: WithdrawalPageProps) {
  const { courseOnSemesterId } = use(params);
  const { isAuthenticated, role } = useSession();
  const locale = useLocale();
  const localePath = useLocalePath();
  const dict = getClientDictionary(locale);
  const t = dict.withdrawalRequest;
  const router = useRouter();

  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reason, setReason] = useState<string>("");
  const [details, setDetails] = useState<string>("");

  useEffect(() => {
    if (!isAuthenticated || role !== "student") {
      router.replace(localePath("dashboard"));
      return;
    }
    const fetch = async () => {
      try {
        const enrollments = await studentApi.getEnrollments();
        setCourses(enrollments);
      } catch (err) {
        console.error("Failed to load enrollments for withdrawal", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [isAuthenticated, role, router, localePath]);

  const enrollment = useMemo(
    () =>
      courses.find((c) => c.courseOnSemesterId === courseOnSemesterId) ?? null,
    [courses, courseOnSemesterId],
  );

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

  if (!enrollment) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <CardTitle>{dict.common.error}</CardTitle>
            <CardDescription>{dict.courses.noCoursesFound}</CardDescription>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      toast.error(t.reasonRequired, { position: "top-center" });
      return;
    }
    setSubmitting(true);
    try {
      await studentApi.requestCourseWithdrawal(courseOnSemesterId, {
        reason,
        details: details.trim() || undefined,
      });
      router.push(localePath("my-courses/withdrawal/success"));
    } catch (err: unknown) {
      console.error("Failed to submit withdrawal request", err);
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : dict.common.error;
      toast.error(msg || dict.common.error, { position: "top-center" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>{t.formTitle}</CardTitle>
            <CardDescription>{t.formSubtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label className="text-sm font-medium mb-1 block">
                  {t.courseLabel}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {enrollment.course.name} • {enrollment.semester.name} •{" "}
                  {enrollment.course.credits} {dict.myCoursesList.credits}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{t.reasonLabel}</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.reasonLabel} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="schedule">
                      {t.reasonOptions.schedule}
                    </SelectItem>
                    <SelectItem value="workload">
                      {t.reasonOptions.workload}
                    </SelectItem>
                    <SelectItem value="health">
                      {t.reasonOptions.health}
                    </SelectItem>
                    <SelectItem value="personal">
                      {t.reasonOptions.personal}
                    </SelectItem>
                    <SelectItem value="other">
                      {t.reasonOptions.other}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{t.detailsLabel}</Label>
                <Textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder={t.detailsPlaceholder}
                  rows={4}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(localePath("my-courses"))}
                  disabled={submitting}
                >
                  {dict.common.cancel}
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? t.submitting : t.submitButton}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
