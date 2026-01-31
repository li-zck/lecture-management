"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminLecturerApi } from "@/lib/api/admin-lecturer";
import { getErrorInfo, logError } from "@/lib/api/error";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LecturerForm } from "../_components/lecturer-form";

const getLecturerErrorMessage = (status: number, fallback: string): string => {
  const messages: Record<number, string> = {
    400: "Please check the lecturer information and try again.",
    409: "A lecturer with this ID or email already exists.",
    422: "Some lecturer information is invalid. Please review the form.",
  };
  return messages[status] || fallback;
};

export default function CreateLecturerPage() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    try {
      await adminLecturerApi.create(values);
      toast.success("Lecturer created successfully");
      router.push("/admin/management/lecturer");
      router.refresh();
    } catch (error: unknown) {
      const { status, message } = getErrorInfo(error);
      logError(error, "Create Lecturer");
      toast.error(getLecturerErrorMessage(status, message));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Lecturer"
        description="Add a new lecturer to the system"
        backUrl="/admin/management/lecturer"
      />
      <LecturerForm onSubmit={handleSubmit} mode="create" />
    </div>
  );
}
