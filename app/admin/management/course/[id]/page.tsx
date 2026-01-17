"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminCourseApi } from "@/lib/api/admin-course";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CourseForm } from "../_components/course-form";

interface EditCoursePageProps {
    params: {
        id: string;
    };
}

export default function EditCoursePage({ params }: EditCoursePageProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState<any>(null);

    useEffect(() => {
        async function fetchCourse() {
            try {
                const data = await adminCourseApi.getById(params.id);
                setInitialValues(data);
            } catch (error) {
                toast.error("Failed to load course data");
                router.push("/admin/management/course");
            } finally {
                setLoading(false);
            }
        }
        fetchCourse();
    }, [params.id, router]);

    const handleSubmit = async (values: any) => {
        try {
            await adminCourseApi.update(params.id, values);
            toast.success("Course updated successfully");
            router.push("/admin/management/course");
            router.refresh();
        } catch (error: any) {
            const msg = error?.response?.data?.message || error.message || "Failed to update course";
            toast.error(msg);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Edit Course"
                description={`Edit details for ${initialValues?.name || 'Course'}`}
                backUrl="/admin/management/course"
            />
            {initialValues && (
                <CourseForm
                    onSubmit={handleSubmit}
                    mode="edit"
                    initialValues={initialValues}
                />
            )}
        </div>
    );
}
