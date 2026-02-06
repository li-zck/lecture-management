"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminDepartmentApi } from "@/lib/api/admin-department";
import { getErrorInfo, logError } from "@/lib/api/error";
import { queryKeys } from "@/lib/query";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { DepartmentForm } from "../_components/department-form";

const getDepartmentErrorMessage = (
  status: number,
  fallback: string,
): string => {
  const messages: Record<number, string> = {
    400: "Please check the department information and try again.",
    404: "Department not found.",
    409: "This lecturer is already head of another department.",
    422: "Some department information is invalid. Please review the form.",
  };
  // Prefer backend message for 409 (e.g. "already head of: Dept Name - DEPT_ID")
  return status === 409 && fallback && fallback !== "An error occurred"
    ? fallback
    : messages[status] || fallback;
};

export default function EditDepartmentPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<any>(null);
  const hasShownErrorRef = useRef(false);

  useEffect(() => {
    if (!id) {
      router.push("/admin/management/department");
    }
  }, [id, router]);

  // Clear stale form data when navigating to a different department
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setInitialValues(null);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function fetchDepartment() {
      try {
        const data = await adminDepartmentApi.getById(id);
        if (cancelled || data.id !== id) return;
        const formValues = {
          ...data,
          headId: data.head?.id || data.headId,
        };
        setInitialValues(formValues);
      } catch (error) {
        if (cancelled) return;
        logError(error, "Fetch Department");
        if (!hasShownErrorRef.current) {
          toast.error("Failed to load department data");
          hasShownErrorRef.current = true;
        }
        router.push("/admin/management/department");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchDepartment();
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  const handleSubmit = async (values: any) => {
    try {
      // Don't send departmentId in update - it can't be changed
      const { departmentId, ...rest } = values;
      const payload = { ...rest };
      if (payload.headId === "none" || !payload.headId) {
        payload.headId = null;
      }

      await adminDepartmentApi.update(id, payload);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.departments.all,
      });
      toast.success("Department updated successfully");
      router.back();
      router.refresh();
    } catch (error: unknown) {
      const { status, message } = getErrorInfo(error);
      logError(error, "Update Department");
      toast.error(getDepartmentErrorMessage(status, message));
    }
  };

  const handleDelete = async () => {
    try {
      await adminDepartmentApi.delete(id);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.departments.all,
      });
      toast.success("Department deleted successfully");
      router.back();
      router.refresh();
    } catch (error: unknown) {
      const { status, message } = getErrorInfo(error);
      logError(error, "Delete Department");

      // Show the actual error message from the backend
      if (message && message !== "An error occurred") {
        toast.error(message);
      } else if (status === 404) {
        toast.error("Department not found");
      } else if (status === 409) {
        toast.error(
          "Cannot delete department: It has related records. Please remove them first.",
        );
      } else {
        toast.error("Failed to delete department");
      }
    }
  };

  if (!id) {
    return null;
  }

  if (loading || !initialValues || initialValues.id !== id) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Department"
        description={`Edit details for ${initialValues.name ?? "Department"}`}
      />
      <DepartmentForm
        key={id}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        mode="edit"
        initialValues={initialValues}
      />
    </div>
  );
}
