"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminStudentApi } from "@/lib/api/admin-student";
import { getErrorInfo, logError } from "@/lib/api/error";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale, useLocalePath } from "@/lib/i18n/use-locale";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StudentForm } from "../_components/student-form";

const getStudentErrorMessage = (
  status: number,
  backendMessage: string,
  dict: any,
): string => {
  if (status === 409 && backendMessage) {
    return backendMessage;
  }

  const messages: Record<number, string> = {
    400: dict.admin.common.checkInfo.replace("{entity}", "student"),
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

  const handleSubmit = async (values: any) => {
    try {
      // Filter out empty string and null values for optional fields
      // Backend validation requires non-empty values if field is provided
      const payload = Object.fromEntries(
        Object.entries(values).filter(
          ([, value]) => value !== "" && value !== null,
        ),
      );

      // Debug: Log the payload being sent
      console.log("[Create Student] Payload:", payload);

      await adminStudentApi.create(payload as typeof values);
      toast.success(
        dict.admin.common.createdSuccess.replace("{entity}", "Student"),
      );
      router.push(localePath("admin/management/student"));
      router.refresh();
    } catch (error: unknown) {
      const { status, message } = getErrorInfo(error);
      logError(error, "Create Student");
      toast.error(getStudentErrorMessage(status, message, dict));
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
      <StudentForm onSubmit={handleSubmit} mode="create" />
    </div>
  );
}
