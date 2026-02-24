"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminCourseApi } from "@/lib/api/admin-course";
import { getErrorInfo, logError } from "@/lib/api/error";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale, useLocalePath } from "@/lib/i18n/use-locale";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CourseForm } from "../_components/course-form";

const getCourseErrorMessage = (
  status: number,
  backendMessage: string,
  dict: any,
): string => {
  const messages: Record<number, string> = {
    400: dict.admin.common.checkInfo.replace("{entity}", "course"),
    409: dict.admin.common.alreadyExists.replace("{entity}", "course"),
    422: dict.admin.common.invalidInfo.replace("{entity}", "course"),
  };
  return messages[status] || backendMessage;
};

export default function CreateCoursePage() {
  const locale = useLocale();
  const localePath = useLocalePath();
  const dict = getClientDictionary(locale);
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    try {
      const payload = { ...values };
      if (
        payload.semesterId === "none" ||
        !payload.semesterId ||
        payload.semesterId.trim() === ""
      ) {
        delete payload.semesterId;
      }
      await adminCourseApi.create(payload);
      toast.success(
        dict.admin.common.createdSuccess.replace("{entity}", "Course"),
      );
      router.push(localePath("admin/management/course"));
      router.refresh();
    } catch (error: unknown) {
      const { status, message } = getErrorInfo(error);
      logError(error, "Create Course");
      toast.error(getCourseErrorMessage(status, message, dict));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={dict.admin.courses.createCourse}
        description={dict.admin.common.addToSystem.replace(
          "{entity}",
          "course",
        )}
      />
      <CourseForm onSubmit={handleSubmit} mode="create" />
    </div>
  );
}
