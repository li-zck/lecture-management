"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminStudentApi } from "@/lib/api/admin-student";
import { getErrorInfo, logError } from "@/lib/api/error";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale, useLocalePath } from "@/lib/i18n/use-locale";
import { queryKeys } from "@/lib/query";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { StudentForm } from "../_components/student-form";

const getStudentErrorMessage = (
  status: number,
  backendMessage: string,
  dict: { admin: { common: Record<string, string> } },
): string => {
  if (status === 409 && backendMessage) {
    return backendMessage;
  }

  const messages: Record<number, string> = {
    400: dict.admin.common.checkInfo.replace("{entity}", "student"),
    401: dict.admin.common.accountInvalidOrSessionExpired,
    409: dict.admin.common.alreadyExists.replace("{entity}", "student"),
    422: dict.admin.common.invalidInfo.replace("{entity}", "student"),
  };
  return messages[status] || backendMessage;
};

export default function CreateStudentPage() {
  const locale = useLocale();
  const localePath = useLocalePath();
  const dict = getClientDictionary(locale);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (values: any) => {
    setSubmitError(null);
    try {
      const payload = Object.fromEntries(
        Object.entries(values).filter(
          ([, value]) => value !== "" && value !== null,
        ),
      );

      await adminStudentApi.create(payload as typeof values);
      await queryClient.invalidateQueries({ queryKey: queryKeys.students.all });
      toast.success(
        dict.admin.common.createdSuccess.replace("{entity}", "Student"),
      );
      router.push(localePath("admin/management/student"));
      router.refresh();
    } catch (error: unknown) {
      const { status, message } = getErrorInfo(error);
      logError(error, "Create Student");
      const displayMessage = getStudentErrorMessage(status, message, dict);
      setSubmitError(displayMessage);
      toast.error(displayMessage);
      throw error; // rethrow so StudentForm can set field-level errors from validation details
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={dict.admin.students.createAccount}
        description={dict.admin.common.addToSystem.replace(
          "{entity}",
          "student",
        )}
      />
      {submitError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive"
        >
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="font-medium">{submitError}</p>
        </div>
      )}
      <StudentForm onSubmit={handleSubmit} mode="create" />
    </div>
  );
}
