"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminDepartmentApi } from "@/lib/api/admin-department";
import { getErrorInfo, logError } from "@/lib/api/error";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DepartmentForm } from "../_components/department-form";

const getDepartmentErrorMessage = (status: number, fallback: string): string => {
  const messages: Record<number, string> = {
    400: "Please check the department information and try again.",
    409: "A department with this ID already exists.",
    422: "Some department information is invalid. Please review the form.",
  };
  return messages[status] || fallback;
};

export default function CreateDepartmentPage() {
  const router = useRouter();

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
      toast.success("Department created successfully");
      router.push("/admin/management/department");
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
        title="Create Department"
        description="Add a new department to the system"
        backUrl="/admin/management/department"
      />
      <DepartmentForm onSubmit={handleSubmit} mode="create" />
    </div>
  );
}
