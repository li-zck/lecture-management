"use client";

import { useLecturer } from "@/components/ui/hooks/use-lecturer";
import { PageHeader } from "@/components/ui/page-header";
import { adminLecturerApi, type LecturerAdmin } from "@/lib/api/admin-lecturer";
import { getErrorInfo, logError } from "@/lib/api/error";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale, useLocalePath } from "@/lib/i18n/use-locale";
import { queryKeys } from "@/lib/query";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { LecturerForm } from "../_components/lecturer-form";

const getLecturerErrorMessage = (
  status: number,
  backendMessage: string,
  dict: any,
): string => {
  if (status === 409 && backendMessage) {
    return backendMessage;
  }

  const messages: Record<number, string> = {
    400: dict.admin.common.checkInfo.replace("{entity}", "lecturer"),
    404: dict.admin.common.notFound.replace("{entity}", "Lecturer"),
    409: dict.admin.common.alreadyExists.replace("{entity}", "lecturer"),
    422: dict.admin.common.invalidInfo.replace("{entity}", "lecturer"),
  };
  return messages[status] || backendMessage;
};

export default function EditLecturerPage() {
  const locale = useLocale();
  const localePath = useLocalePath();
  const dict = getClientDictionary(locale);
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const router = useRouter();
  const queryClient = useQueryClient();
  const { lecturer, loading, error } = useLecturer(id || null);

  useEffect(() => {
    if (!id) {
      router.push(localePath("admin/management/lecturer"));
      return;
    }
  }, [id, router, localePath]);

  useEffect(() => {
    if (error) {
      logError(error, "Fetch Lecturer");
      toast.error(dict.admin.common.loadFailed.replace("{entity}", "lecturer"));
      router.push(localePath("admin/management/lecturer"));
    }
  }, [error, router, dict, localePath]);

  const handleSubmit = async (values: any) => {
    try {
      const payload = { ...values };
      if (!payload.password) {
        delete payload.password;
      }
      if (
        payload.departmentHeadId === "" ||
        payload.departmentHeadId === "__none__"
      ) {
        payload.departmentHeadId = null;
      }
      if (payload.gender === "__none__" || payload.gender === undefined) {
        delete payload.gender;
      } else if (payload.gender === "male") {
        payload.gender = true;
      } else if (payload.gender === "female") {
        payload.gender = false;
      }
      if (!payload.birthDate?.trim()) delete payload.birthDate;
      if (!payload.citizenId?.trim()) delete payload.citizenId;
      if (!payload.phone?.trim()) delete payload.phone;
      if (!payload.address?.trim()) delete payload.address;

      await adminLecturerApi.update(id, payload);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.lecturers.all,
      });
      toast.success(
        dict.admin.common.updatedSuccess.replace("{entity}", "Lecturer"),
      );
      router.back();
      router.refresh();
    } catch (error: unknown) {
      const { status, message } = getErrorInfo(error);
      logError(error, "Update Lecturer");
      toast.error(getLecturerErrorMessage(status, message, dict));
    }
  };

  const lecturerWithExtras = lecturer as LecturerAdmin & {
    departmentHead?: { id: string };
  };
  const initialValues =
    lecturer && lecturer.id === id
      ? {
          username: lecturer.username ?? "",
          email: lecturer.email ?? "",
          fullName: lecturer.fullName ?? "",
          lecturerId: lecturer.lecturerId ?? "",
          departmentHeadId:
            lecturer.departmentHeadId ??
            lecturerWithExtras.departmentHead?.id ??
            "__none__",
          gender: (lecturerWithExtras.gender === true
            ? "male"
            : lecturerWithExtras.gender === false
              ? "female"
              : "__none__") as "male" | "female" | "__none__",
          birthDate: lecturerWithExtras.birthDate ?? "",
          citizenId: lecturerWithExtras.citizenId ?? "",
          phone: lecturerWithExtras.phone ?? "",
          address: lecturerWithExtras.address ?? "",
        }
      : null;

  if (!id || loading || error) {
    return <div>{dict.admin.common.loading}</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={dict.admin.lecturers.editAccount}
        description={dict.admin.common.updateDetails.replace(
          "{entity}",
          initialValues?.fullName ?? "Lecturer",
        )}
      />
      {initialValues && (
        <LecturerForm
          key={id}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          mode="edit"
        />
      )}
    </div>
  );
}
