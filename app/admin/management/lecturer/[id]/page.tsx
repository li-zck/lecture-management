"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminLecturerApi } from "@/lib/api/admin-lecturer";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { LecturerForm } from "../_components/lecturer-form";

interface EditLecturerPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditLecturerPage({ params }: EditLecturerPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<any>(null);
  const hasShownErrorRef = useRef(false);

  useEffect(() => {
    async function fetchLecturer() {
      try {
        const data = await adminLecturerApi.getById(id);
        setInitialValues(data);
      } catch {
        if (!hasShownErrorRef.current) {
          toast.error("Failed to load lecturer data");
          hasShownErrorRef.current = true;
        }
        router.push("/admin/management/lecturer");
      } finally {
        setLoading(false);
      }
    }
    fetchLecturer();
  }, [id, router]);

  const handleSubmit = async (values: any) => {
    try {
      const payload = { ...values };
      if (!payload.password) {
        delete payload.password;
      }

      await adminLecturerApi.update(id, payload);
      toast.success("Lecturer updated successfully");
      router.push("/admin/management/lecturer");
      router.refresh();
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to update lecturer";
      toast.error(msg);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Lecturer"
        description={`Edit details for ${initialValues?.fullName || "Lecturer"}`}
        backUrl="/admin/management/lecturer"
      />
      {initialValues && (
        <LecturerForm
          onSubmit={handleSubmit}
          mode="edit"
          initialValues={initialValues}
        />
      )}
    </div>
  );
}
