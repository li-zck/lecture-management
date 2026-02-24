"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminSemesterApi } from "@/lib/api/admin-semester";
import { getErrorInfo, logError } from "@/lib/api/error";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";
import { queryKeys } from "@/lib/query";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { SemesterForm } from "../_components/semester-form";

interface EditSemesterPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditSemesterPage({ params }: EditSemesterPageProps) {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const getSemesterErrorMessage = (
    status: number,
    fallback: string,
  ): string => {
    const messages: Record<number, string> = {
      400: dict.admin.common.checkInfo.replace("{entity}", "semester"),
      404: dict.admin.common.notFound.replace("{entity}", "Semester"),
      409: dict.admin.common.alreadyExists.replace("{entity}", "semester"),
      422: dict.admin.common.invalidInfo.replace("{entity}", "semester"),
    };
    return messages[status] || fallback;
  };
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    async function fetchSemester() {
      try {
        const data = await adminSemesterApi.getById(id);
        setInitialValues(data);
      } catch (error) {
        logError(error, "Fetch Semester");
        toast.error(
          dict.admin.common.loadFailed.replace("{entity}", "semester"),
        );
        router.push("/admin/management/semester");
      } finally {
        setLoading(false);
      }
    }
    fetchSemester();
  }, [id, router, dict]);

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
      };

      await adminSemesterApi.update(id, payload);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.semesters.all,
      });
      toast.success(
        dict.admin.common.updatedSuccess.replace("{entity}", "Semester"),
      );
      router.back();
      router.refresh();
    } catch (error: unknown) {
      const { status, message } = getErrorInfo(error);
      logError(error, "Update Semester");
      toast.error(getSemesterErrorMessage(status, message));
    }
  };

  if (loading) {
    return <div>{dict.admin.common.loading}</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={dict.admin.semesters.editSemester}
        description={`${dict.admin.semesters.editSemester}: ${initialValues?.name || "Semester"}`}
      />
      {initialValues && (
        <SemesterForm
          onSubmit={handleSubmit}
          mode="edit"
          initialValues={initialValues}
        />
      )}
    </div>
  );
}
