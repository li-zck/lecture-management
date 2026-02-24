"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminCourseApi } from "@/lib/api/admin-course";
import { getErrorInfo, logError } from "@/lib/api/error";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale, useLocalePath } from "@/lib/i18n/use-locale";
import { queryKeys } from "@/lib/query";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { CourseForm } from "../_components/course-form";

interface EditCoursePageProps {
  params: Promise<{
    id: string;
  }>;
}

const getCourseErrorMessage = (
  status: number,
  backendMessage: string,
  dict: any,
): string => {
  const messages: Record<number, string> = {
    400: dict.admin.common.checkInfo.replace("{entity}", "course"),
    404: dict.admin.common.notFound.replace("{entity}", "Course"),
    409: dict.admin.common.alreadyExists.replace("{entity}", "course"),
    422: dict.admin.common.invalidInfo.replace("{entity}", "course"),
  };
  return messages[status] || backendMessage;
};

export default function EditCoursePage({ params }: EditCoursePageProps) {
  const { id } = use(params);
  const locale = useLocale();
  const localePath = useLocalePath();
  const dict = getClientDictionary(locale);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const data = await adminCourseApi.getById(id, {
          includeDepartment: true,
          includeCourseOnSemesters: true,
        });
        setInitialValues(data);
      } catch (error) {
        logError(error, "Fetch Course");
        toast.error(dict.admin.common.loadFailed.replace("{entity}", "course"));
        router.push(localePath("admin/management/course"));
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [id, router, dict, localePath]);

  const handleSubmit = async (values: any) => {
    try {
      const { semesterId: _omit, ...updatePayload } = values;
      await adminCourseApi.update(id, updatePayload);
      await queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
      toast.success(
        dict.admin.common.updatedSuccess.replace("{entity}", "Course"),
      );
      router.back();
      router.refresh();
    } catch (error: unknown) {
      const { status, message } = getErrorInfo(error);
      logError(error, "Update Course");
      toast.error(getCourseErrorMessage(status, message, dict));
    }
  };

  if (loading) {
    return <div>{dict.admin.common.loading}</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={dict.admin.courses.editCourse}
        description={dict.admin.common.updateDetails.replace(
          "{entity}",
          initialValues?.name || "Course",
        )}
      />
      {initialValues && (
        <CourseForm
          onSubmit={handleSubmit}
          mode="edit"
          initialValues={initialValues}
          courseId={id}
          initialOfferings={initialValues.courseOnSemesters}
        />
      )}
    </div>
  );
}
