"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminDepartmentApi } from "@/lib/api/admin-department";
import { getErrorInfo, logError } from "@/lib/api/error";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale, useLocalePath } from "@/lib/i18n/use-locale";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DepartmentForm } from "../_components/department-form";

export default function CreateDepartmentPage() {
  const locale = useLocale();
  const localePath = useLocalePath();
  const dict = getClientDictionary(locale);
  const router = useRouter();

  const getDepartmentErrorMessage = (
    status: number,
    serverMessage: string,
  ): string => {
    if (status === 409) return serverMessage;
    const messages: Record<number, string> = {
      400: dict.admin.common.checkInfo.replace("{entity}", "department"),
      422: dict.admin.common.invalidInfo.replace("{entity}", "department"),
    };
    return messages[status] || serverMessage;
  };

  const handleSubmit = async (values: any) => {
    try {
      // Handle optional headId - remove if "none", empty string, or undefined
      const payload = { ...values };
      if (
        payload.headId === "none" ||
        !payload.headId ||
        payload.headId.trim() === ""
      ) {
        delete payload.headId;
      }

      await adminDepartmentApi.create(payload);
      toast.success(
        dict.admin.common.createdSuccess.replace("{entity}", "Department"),
      );
      router.push(localePath("admin/management/department"));
      router.refresh();
    } catch (error: unknown) {
      const { status, message } = getErrorInfo(error);
      logError(error, "Create Department");
      toast.error(getDepartmentErrorMessage(status, message));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={dict.admin.departments.createDepartment}
        description={dict.admin.common.addToSystem.replace(
          "{entity}",
          "department",
        )}
      />
      <DepartmentForm onSubmit={handleSubmit} mode="create" />
    </div>
  );
}
