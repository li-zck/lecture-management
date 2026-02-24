"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminSemesterApi } from "@/lib/api/admin-semester";
import { getErrorInfo, logError } from "@/lib/api/error";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SemesterForm } from "../_components/semester-form";

export default function CreateSemesterPage() {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const router = useRouter();

  const getSemesterErrorMessage = (
    status: number,
    fallback: string,
  ): string => {
    const messages: Record<number, string> = {
      400: dict.admin.common.checkInfo.replace("{entity}", "semester"),
      409: dict.admin.common.alreadyExists.replace("{entity}", "semester"),
      422: dict.admin.common.invalidInfo.replace("{entity}", "semester"),
    };
    return messages[status] || fallback;
  };

  const handleSubmit = async (values: any) => {
    try {
      // Ensure dates are ISO strings
      const payload = {
        ...values,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
      };

      await adminSemesterApi.create(payload);
      toast.success(
        dict.admin.common.createdSuccess.replace("{entity}", "Semester"),
      );
      router.push("/admin/management/semester");
      router.refresh();
    } catch (error: unknown) {
      const { status, message } = getErrorInfo(error);
      logError(error, "Create Semester");
      toast.error(getSemesterErrorMessage(status, message));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={dict.admin.semesters.createSemester}
        description={dict.admin.common.addToSystem.replace(
          "{entity}",
          "semester",
        )}
      />
      <SemesterForm onSubmit={handleSubmit} mode="create" />
    </div>
  );
}
