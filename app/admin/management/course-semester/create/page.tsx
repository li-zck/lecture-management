"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminCourseSemesterApi } from "@/lib/api/admin-course-semester";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CourseSemesterForm } from "../_components/course-semester-form";

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
        } catch (error: any) {
            const msg = error?.response?.data?.message || error.message || "Failed to create schedule";
            toast.error(msg);
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

