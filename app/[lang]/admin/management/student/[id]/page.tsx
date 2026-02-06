"use client";

import { useStudent } from "@/components/ui/hooks/use-students";
import { PageHeader } from "@/components/ui/page-header";
import { adminStudentApi } from "@/lib/api/admin-student";
import { getErrorInfo, logError } from "@/lib/api/error";
import { queryKeys } from "@/lib/query";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { StudentForm } from "../_components/student-form";

/** Normalize API date (ISO or YYYY-MM-DD) to YYYY-MM-DD for form */
function normalizeBirthDate(v: string | null | undefined): string {
  if (v == null || v.trim() === "") return "";
  const s = v.trim();
  return s.includes("T") ? s.split("T")[0] : s;
}

const getStudentErrorMessage = (
  status: number,
  backendMessage: string,
): string => {
  // For 409 conflicts, use the backend message which is more specific
  // (e.g., "Email already exists" or "Username already exists")
  if (status === 409 && backendMessage) {
    return backendMessage;
  }

  const messages: Record<number, string> = {
    400: "Please check the student information and try again.",
    404: "Student not found.",
    409: "A student with this email already exists.",
    422: "Some student information is invalid. Please review the form.",
  };
  return messages[status] || backendMessage;
};

export default function EditStudentPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const router = useRouter();
  const queryClient = useQueryClient();
  const { student, loading, error } = useStudent(id || null);

  useEffect(() => {
    if (!id) {
      router.push("/admin/management/student");
      return;
    }
  }, [id, router]);

  useEffect(() => {
    if (error) {
      logError(error, "Fetch Student");
      toast.error("Failed to load student data");
      router.push("/admin/management/student");
    }
  }, [error, router]);

  const handleSubmit = async (values: any) => {
    try {
      // Filter out empty string and null values for optional fields
      // Backend validation requires non-empty values if field is provided
      // Empty newPassword/confirmPassword will be filtered out (no password change)
      const payload = Object.fromEntries(
        Object.entries(values).filter(
          ([, value]) => value !== "" && value !== null,
        ),
      );

      await adminStudentApi.update(id, payload);
      await queryClient.invalidateQueries({ queryKey: queryKeys.students.all });
      toast.success("Student updated successfully");
      router.back();
      router.refresh();
    } catch (error: unknown) {
      const { status, message } = getErrorInfo(error);
      logError(error, "Update Student");
      toast.error(getStudentErrorMessage(status, message));
    }
  };

  const initialValues =
    student && student.id === id
      ? {
          username: student.username ?? "",
          email: student.email ?? "",
          fullName: student.fullName ?? "",
          studentId: student.studentId ?? "",
          departmentId: student.departmentId ?? student.department?.id ?? "",
          citizenId: student.citizenId ?? "",
          phone: student.phone ?? "",
          address: student.address ?? "",
          gender: student.gender ?? true,
          birthDate: normalizeBirthDate(student.birthDate),
        }
      : null;

  if (!id || loading || error) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Student"
        description={`Edit details for ${initialValues?.fullName ?? "Student"}`}
      />
      {initialValues && (
        <StudentForm
          key={id}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          mode="edit"
        />
      )}
    </div>
  );
}
