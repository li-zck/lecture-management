"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminEnrollmentSessionApi } from "@/lib/api/admin-enrollment-session";
import { getErrorInfo, logError } from "@/lib/api/error";
import type { CreateEnrollmentSessionFormValues } from "@/lib/zod/schemas/create/enrollment-session";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EnrollmentSessionForm } from "../_components/enrollment-session-form";

export default function CreateEnrollmentSessionPage() {
  const router = useRouter();

  const handleSubmit = async (values: CreateEnrollmentSessionFormValues) => {
    try {
      await adminEnrollmentSessionApi.create({
        ...values,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
      });
      toast.success("Enrollment session created successfully");
      router.back();
      router.refresh();
    } catch (error: unknown) {
      const { message } = getErrorInfo(error);
      logError(error, "Create Enrollment Session");
      toast.error(message || "Failed to create enrollment session");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Enrollment Session"
        description="Define a new time period when students can enroll in courses"
      />
      <EnrollmentSessionForm onSubmit={handleSubmit} mode="create" />
    </div>
  );
}
