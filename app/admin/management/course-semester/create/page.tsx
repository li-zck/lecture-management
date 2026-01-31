"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminCourseSemesterApi } from "@/lib/api/admin-course-semester";
import { getErrorInfo, logError } from "@/lib/api/error";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CourseSemesterForm } from "../_components/course-semester-form";

const getScheduleErrorMessage = (status: number, fallback: string): string => {
  const messages: Record<number, string> = {
    400: "Please check the schedule information and try again.",
    409: "This course is already scheduled for this semester.",
    422: "Some schedule information is invalid. Please review the form.",
  };
  return messages[status] || fallback;
};

export default function CreateCourseSemesterPage() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    try {
      const payload = { ...values };
      if (payload.lecturerId === "none" || !payload.lecturerId) {
        delete payload.lecturerId;
      }

      await adminCourseSemesterApi.create(payload);
      toast.success("Schedule created successfully");
      router.push("/admin/management/course-semester");
      router.refresh();
    } catch (error: unknown) {
      const { status, message } = getErrorInfo(error);
      logError(error, "Create Course Schedule");
      toast.error(getScheduleErrorMessage(status, message));
    }
  };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Add Course Schedule"
                description="Assign a course to a semester and lecturer"
                backUrl="/admin/management/course-semester"
            />
            <CourseSemesterForm onSubmit={handleSubmit} mode="create" />
        </div>
    );
}

