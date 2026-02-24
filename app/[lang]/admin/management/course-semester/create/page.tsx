"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminCourseSemesterApi } from "@/lib/api/admin-course-semester";
import { getErrorInfo, logError } from "@/lib/api/error";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CourseSemesterForm } from "../_components/course-semester-form";

export default function CreateCourseSemesterPage() {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const router = useRouter();

  const getScheduleErrorMessage = (
    status: number,
    fallback: string,
  ): string => {
    const messages: Record<number, string> = {
      400: dict.admin.common.checkInfo.replace("{entity}", "schedule"),
      409: dict.admin.common.alreadyExists.replace("{entity}", "schedule"),
      422: dict.admin.common.invalidInfo.replace("{entity}", "schedule"),
    };
    return messages[status] || fallback;
  };

  const handleSubmit = async (values: any) => {
    try {
      const payload = { ...values };
      if (payload.lecturerId === "none" || !payload.lecturerId) {
        delete payload.lecturerId;
      }

      await adminCourseSemesterApi.create(payload);
      toast.success(
        dict.admin.common.createdSuccess.replace("{entity}", "Schedule"),
      );
      router.back();
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
        title={dict.admin.courseSemesters.addSchedule}
        description={dict.admin.courseSemesters.addSchedulePageDesc}
      />
      <CourseSemesterForm onSubmit={handleSubmit} mode="create" />
    </div>
  );
}
