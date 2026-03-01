"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminLecturerApi } from "@/lib/api/admin-lecturer";
import { getErrorInfo, logError } from "@/lib/api/error";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale, useLocalePath } from "@/lib/i18n/use-locale";
import { queryKeys } from "@/lib/query";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { LecturerForm } from "../_components/lecturer-form";

const getLecturerErrorMessage = (
  status: number,
  backendMessage: string,
  dict: { admin: { common: Record<string, string> } },
): string => {
  if (status === 409 && backendMessage) {
    return backendMessage;
  }

  const messages: Record<number, string> = {
    400: dict.admin.common.checkInfo.replace("{entity}", "lecturer"),
    401: dict.admin.common.accountInvalidOrSessionExpired,
    409: dict.admin.common.alreadyExists.replace("{entity}", "lecturer"),
    422: dict.admin.common.invalidInfo.replace("{entity}", "lecturer"),
  };
  return messages[status] || backendMessage;
};

export default function CreateLecturerPage() {
  const locale = useLocale();
  const localePath = useLocalePath();
  const dict = getClientDictionary(locale);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (values: any) => {
    setSubmitError(null);
    try {
      const payload = { ...values };
      if (payload.gender === "male") payload.gender = true;
      else if (payload.gender === "female") payload.gender = false;
      else delete payload.gender;
      if (!payload.birthDate?.trim()) delete payload.birthDate;
      if (!payload.citizenId?.trim()) delete payload.citizenId;
      if (!payload.phone?.trim()) delete payload.phone;
      if (!payload.address?.trim()) delete payload.address;

      await adminLecturerApi.create(payload);
      await queryClient.invalidateQueries({ queryKey: queryKeys.lecturers.all });
      toast.success(
        dict.admin.common.createdSuccess.replace("{entity}", "Lecturer"),
      );
      router.push(localePath("admin/management/lecturer"));
      router.refresh();
    } catch (error: unknown) {
      const { status, message } = getErrorInfo(error);
      logError(error, "Create Lecturer");
      const displayMessage = getLecturerErrorMessage(status, message, dict);
      setSubmitError(displayMessage);
      toast.error(displayMessage);
      throw error; // rethrow so LecturerForm can set field-level errors from validation details
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={dict.admin.lecturers.createAccount}
        description={dict.admin.common.addToSystem.replace(
          "{entity}",
          "lecturer",
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
      <LecturerForm onSubmit={handleSubmit} mode="create" />
    </div>
  );
}
