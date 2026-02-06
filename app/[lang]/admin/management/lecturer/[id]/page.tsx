"use client";

import { useLecturer } from "@/components/ui/hooks/use-lecturer";
import { PageHeader } from "@/components/ui/page-header";
import { adminLecturerApi } from "@/lib/api/admin-lecturer";
import { getErrorInfo, logError } from "@/lib/api/error";
import { queryKeys } from "@/lib/query";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { LecturerForm } from "../_components/lecturer-form";

const getLecturerErrorMessage = (status: number, fallback: string): string => {
  const messages: Record<number, string> = {
    400: "Please check the lecturer information and try again.",
    404: "Lecturer not found.",
    409: "A lecturer with this email already exists.",
    422: "Some lecturer information is invalid. Please review the form.",
  };
  return messages[status] || fallback;
};

export default function EditLecturerPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const router = useRouter();
  const queryClient = useQueryClient();
  const { lecturer, loading, error } = useLecturer(id || null);

  useEffect(() => {
    if (!id) {
      router.push("/admin/management/lecturer");
      return;
    }
  }, [id, router]);

  useEffect(() => {
    if (error) {
      logError(error, "Fetch Lecturer");
      toast.error("Failed to load lecturer data");
      router.push("/admin/management/lecturer");
    }
  }, [error, router]);

  const handleSubmit = async (values: any) => {
    try {
      const payload = { ...values };
      if (!payload.password) {
        delete payload.password;
      }
      if (
        payload.departmentHeadId === "" ||
        payload.departmentHeadId === "__none__"
      ) {
        payload.departmentHeadId = null;
      }

      await adminLecturerApi.update(id, payload);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.lecturers.all,
      });
      toast.success("Lecturer updated successfully");
      router.back();
      router.refresh();
    } catch (error: unknown) {
      const { status, message } = getErrorInfo(error);
      logError(error, "Update Lecturer");
      toast.error(getLecturerErrorMessage(status, message));
    }
  };

  const initialValues =
    lecturer && lecturer.id === id
      ? {
          username: lecturer.username ?? "",
          email: lecturer.email ?? "",
          fullName: lecturer.fullName ?? "",
          lecturerId: lecturer.lecturerId ?? "",
          departmentHeadId:
            lecturer.departmentHeadId ??
            (lecturer as { departmentHead?: { id: string } }).departmentHead
              ?.id ??
            "__none__",
        }
      : null;

  if (!id || loading || error) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Lecturer"
        description={`Edit details for ${initialValues?.fullName ?? "Lecturer"}`}
      />
      {initialValues && (
        <LecturerForm
          key={id}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          mode="edit"
        />
      )}
    </div>
  );
}
