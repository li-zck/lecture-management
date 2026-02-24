"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminLecturerApi } from "@/lib/api/admin-lecturer";
import { getErrorInfo, logError } from "@/lib/api/error";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale, useLocalePath } from "@/lib/i18n/use-locale";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LecturerForm } from "../_components/lecturer-form";

const getLecturerErrorMessage = (
  status: number,
  backendMessage: string,
  dict: any,
): string => {
  if (status === 409 && backendMessage) {
    return backendMessage;
  }

  const messages: Record<number, string> = {
    400: dict.admin.common.checkInfo.replace("{entity}", "lecturer"),
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

  const handleSubmit = async (values: any) => {
    try {
      await adminLecturerApi.create(values);
      toast.success(
        dict.admin.common.createdSuccess.replace("{entity}", "Lecturer"),
      );
      router.push(localePath("admin/management/lecturer"));
      router.refresh();
    } catch (error: unknown) {
      const { status, message } = getErrorInfo(error);
      logError(error, "Create Lecturer");
      toast.error(getLecturerErrorMessage(status, message, dict));
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
      <LecturerForm onSubmit={handleSubmit} mode="create" />
    </div>
  );
}
