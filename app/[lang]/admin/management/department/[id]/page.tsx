"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminDepartmentApi } from "@/lib/api/admin-department";
import { getErrorInfo, logError } from "@/lib/api/error";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale, useLocalePath } from "@/lib/i18n/use-locale";
import { queryKeys } from "@/lib/query";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { DepartmentForm } from "../_components/department-form";

export default function EditDepartmentPage() {
  const locale = useLocale();
  const localePath = useLocalePath();
  const dict = getClientDictionary(locale);
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const router = useRouter();
  const queryClient = useQueryClient();

  const getDepartmentErrorMessage = (
    status: number,
    fallback: string,
  ): string => {
    const messages: Record<number, string> = {
      400: dict.admin.common.checkInfo.replace("{entity}", "department"),
      404: dict.admin.common.notFound.replace("{entity}", "Department"),
      409: dict.admin.departments.alreadyHead,
      422: dict.admin.common.invalidInfo.replace("{entity}", "department"),
    };
    return status === 409 && fallback && fallback !== "An error occurred"
      ? fallback
      : messages[status] || fallback;
  };
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<any>(null);
  const hasShownErrorRef = useRef(false);

  useEffect(() => {
    if (!id) {
      router.push(localePath("admin/management/department"));
    }
  }, [id, router, localePath]);

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
          toast.error(
            dict.admin.common.loadFailed.replace("{entity}", "department"),
          );
          hasShownErrorRef.current = true;
        }
        router.push(localePath("admin/management/department"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchDepartment();
    return () => {
      cancelled = true;
    };
  }, [id, router, dict, localePath]);

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
      toast.success(
        dict.admin.common.updatedSuccess.replace("{entity}", "Department"),
      );
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
      toast.success(
        dict.admin.common.deletedSuccess.replace("{entity}", "Department"),
      );
      router.back();
      router.refresh();
    } catch (error: unknown) {
      const { status, message } = getErrorInfo(error);
      logError(error, "Delete Department");

      // Show the actual error message from the backend
      if (message && message !== "An error occurred") {
        toast.error(message);
      } else if (status === 404) {
        toast.error(
          dict.admin.common.notFound.replace("{entity}", "Department"),
        );
      } else if (status === 409) {
        toast.error(dict.admin.departments.cannotDelete);
      } else {
        toast.error(
          dict.admin.common.deleteFailed.replace("{entity}", "department"),
        );
      }
    }
  };

  if (!id) {
    return null;
  }

  if (loading || !initialValues || initialValues.id !== id) {
    return <div>{dict.admin.common.loading}</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={dict.admin.departments.editDepartment}
        description={dict.admin.common.updateDetails.replace(
          "{entity}",
          initialValues.name ?? "Department",
        )}
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
