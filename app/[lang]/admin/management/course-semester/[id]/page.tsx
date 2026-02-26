"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminCourseSemesterApi } from "@/lib/api/admin-course-semester";
import {
  formatScheduleConflictError,
  getErrorInfo,
  isScheduleConflictError,
  logError,
} from "@/lib/api/error";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";
import { queryKeys } from "@/lib/query";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { CourseSemesterForm } from "../_components/course-semester-form";

interface EditCourseSemesterPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditCourseSemesterPage({
  params,
}: EditCourseSemesterPageProps) {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<any>(null);

  const getScheduleErrorMessage = (
    status: number,
    fallback: string,
  ): string => {
    const messages: Record<number, string> = {
      400: dict.admin.common.checkInfo.replace("{entity}", "schedule"),
      404: dict.admin.common.notFound.replace("{entity}", "Schedule"),
      409: dict.admin.common.alreadyExists.replace("{entity}", "schedule"),
      422: dict.admin.common.invalidInfo.replace("{entity}", "schedule"),
    };
    return messages[status] || fallback;
  };

  useEffect(() => {
    async function fetchCourseSemester() {
      try {
        const data = await adminCourseSemesterApi.getById(id);
        setInitialValues(data);
      } catch (error) {
        logError(error, "Fetch Course Schedule");
        toast.error(
          dict.admin.common.loadFailed.replace("{entity}", "schedule"),
        );
        router.push("/admin/management/course-semester");
      } finally {
        setLoading(false);
      }
    }
    fetchCourseSemester();
  }, [id, router, dict]);

  const handleSubmit = async (values: any) => {
    try {
      const payload = { ...values };
      if (payload.lecturerId === "none" || !payload.lecturerId) {
        payload.lecturerId = null;
      }

      const updatePayload: any = {
        lecturerId: payload.lecturerId,
        dayOfWeek: payload.dayOfWeek,
        startTime: payload.startTime,
        endTime: payload.endTime,
        mode: payload.mode,
        location: payload.location,
        meetingUrl: payload.meetingUrl || null,
        capacity: payload.capacity,
      };

      await adminCourseSemesterApi.update(id, updatePayload);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.courseSemesters.all,
      });
      toast.success(
        dict.admin.common.updatedSuccess.replace("{entity}", "Schedule"),
      );
      router.back();
      router.refresh();
    } catch (error: unknown) {
      const { status, message } = getErrorInfo(error);
      logError(error, "Update Course Schedule");
      const displayMessage = isScheduleConflictError(error)
        ? formatScheduleConflictError(message)
        : getScheduleErrorMessage(status, message);
      toast.error(displayMessage, { duration: 8000 });
    }
  };

  if (loading) {
    return <div>{dict.admin.common.loading}</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={dict.admin.courseSemesters.editSchedule}
        description={dict.admin.courseSemesters.editSchedulePageDesc}
      />
      {initialValues && (
        <CourseSemesterForm
          onSubmit={handleSubmit}
          mode="edit"
          initialValues={initialValues}
        />
      )}
    </div>
  );
}
