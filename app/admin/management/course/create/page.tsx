"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminCourseApi } from "@/lib/api/admin-course";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CourseForm } from "../_components/course-form";

export default function CreateCoursePage() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    try {
      await adminCourseApi.create(values);
      toast.success("Course created successfully");
      router.push("/admin/management/course");
      router.refresh();
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to create course";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Course"
        description="Add a new course to the system"
        backUrl="/admin/management/course"
      />
      <CourseForm onSubmit={handleSubmit} mode="create" />
    </div>
  );
}
