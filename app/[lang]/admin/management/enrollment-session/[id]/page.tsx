"use client";

import { useEnrollmentSession } from "@/components/ui/hooks/use-enrollment-sessions";
import { PageHeader } from "@/components/ui/page-header";
import { adminEnrollmentSessionApi } from "@/lib/api/admin-enrollment-session";
import { getErrorInfo, logError } from "@/lib/api/error";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";
import { queryKeys } from "@/lib/query";
import type { CreateEnrollmentSessionFormValues } from "@/lib/zod/schemas/create/enrollment-session";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { EnrollmentSessionForm } from "../_components/enrollment-session-form";

export default function EditEnrollmentSessionPage() {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;
  const { enrollmentSession, loading, error } = useEnrollmentSession(id);

  const handleSubmit = async (values: CreateEnrollmentSessionFormValues) => {
    try {
      await adminEnrollmentSessionApi.update(id, {
        ...values,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.enrollmentSessions.all,
      });
      toast.success(
        dict.admin.common.updatedSuccess.replace(
          "{entity}",
          "Enrollment session",
        ),
      );
      router.back();
      router.refresh();
    } catch (err: unknown) {
      const { message } = getErrorInfo(err);
      logError(err, "Update Enrollment Session");
      toast.error(
        message ||
          dict.admin.common.updateFailed.replace(
            "{entity}",
            "enrollment session",
          ),
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">
          {dict.admin.enrollmentSessions.loadingSession}
        </div>
      </div>
    );
  }

  if (error || !enrollmentSession) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-destructive">
          {dict.admin.enrollmentSessions.loadFailed}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={dict.admin.enrollmentSessions.editSession}
        description={dict.admin.enrollmentSessions.editing.replace(
          "{name}",
          enrollmentSession.name ||
            dict.admin.enrollmentSessions.unnamedSession,
        )}
      />
      <EnrollmentSessionForm
        initialValues={{
          name: enrollmentSession.name ?? "",
          semesterId: enrollmentSession.semesterId,
          startDate: enrollmentSession.startDate,
          endDate: enrollmentSession.endDate,
          isActive: enrollmentSession.isActive,
        }}
        onSubmit={handleSubmit}
        mode="edit"
      />
    </div>
  );
}
