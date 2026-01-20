"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminDepartmentApi } from "@/lib/api/admin-department";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DepartmentForm } from "../_components/department-form";

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
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to create department";
      toast.error(msg);
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
