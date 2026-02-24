"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminEnrollmentSessionApi } from "@/lib/api/admin-enrollment-session";
import { getErrorInfo, logError } from "@/lib/api/error";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";
import type { CreateEnrollmentSessionFormValues } from "@/lib/zod/schemas/create/enrollment-session";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EnrollmentSessionForm } from "../_components/enrollment-session-form";

export default function CreateEnrollmentSessionPage() {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const router = useRouter();

  const handleSubmit = async (values: CreateEnrollmentSessionFormValues) => {
    try {
      await adminEnrollmentSessionApi.create({
        ...values,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
      });
      toast.success(
        dict.admin.common.createdSuccess.replace(
          "{entity}",
          "Enrollment session",
        ),
      );
      router.back();
      router.refresh();
    } catch (error: unknown) {
      const { message } = getErrorInfo(error);
      logError(error, "Create Enrollment Session");
      toast.error(
        message ||
          dict.admin.common.createFailed.replace(
            "{entity}",
            "enrollment session",
          ),
      );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={dict.admin.enrollmentSessions.createSession}
        description={dict.admin.enrollmentSessions.createPageDesc}
      />
      <EnrollmentSessionForm onSubmit={handleSubmit} mode="create" />
    </div>
  );
}
