"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminStudentApi } from "@/lib/api/admin-student";
import { getErrorInfo, logError } from "@/lib/api/error";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { StudentForm } from "../_components/student-form";

interface EditStudentPageProps {
  params: Promise<{
    id: string;
  }>;
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

export default function EditStudentPage({ params }: EditStudentPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    async function fetchStudent() {
      try {
        const data = await adminStudentApi.getById(id);
        setInitialValues(data);
      } catch (error) {
        logError(error, "Fetch Student");
        toast.error("Failed to load student data");
        router.push("/admin/management/student");
      } finally {
        setLoading(false);
      }
    }
    fetchStudent();
  }, [id, router]);

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
      toast.success("Student updated successfully");
      router.push("/admin/management/student");
      router.refresh();
    } catch (error: unknown) {
      const { status, message } = getErrorInfo(error);
      logError(error, "Update Student");
      toast.error(getStudentErrorMessage(status, message));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Student"
        description={`Edit details for ${initialValues?.fullName || "Student"}`}
      />
      {initialValues && (
        <StudentForm
          onSubmit={handleSubmit}
          mode="edit"
          initialValues={initialValues}
        />
      )}
    </div>
  );
}
