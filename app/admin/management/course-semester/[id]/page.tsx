"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminCourseSemesterApi } from "@/lib/api/admin-course-semester";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CourseSemesterForm } from "../_components/course-semester-form";

interface EditCourseSemesterPageProps {
    params: {
        id: string;
    };
}

export default function EditCourseSemesterPage({ params }: EditCourseSemesterPageProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState<any>(null);

    useEffect(() => {
        async function fetchCourseSemester() {
            try {
                const data = await adminCourseSemesterApi.getById(params.id);
                setInitialValues(data);
            } catch (error) {
                toast.error("Failed to load schedule data");
                router.push("/admin/management/course-semester");
            } finally {
                setLoading(false);
            }
        }
        fetchCourseSemester();
    }, [params.id, router]);

    const handleSubmit = async (values: any) => {
        try {
            const payload = { ...values };
            if (payload.lecturerId === "none" || !payload.lecturerId) {
                payload.lecturerId = null;
            }
            // UpdateCourseSemesterRequest might not accept courseId/semesterId changes (usually fixed)
            // But form submits them. API might ignore them or throw error.
            // admin-course-semester.ts UpdateCourseSemesterRequest DOES NOT have courseId/semesterId.
            // So we should verify payload.
            // Clean payload:
            const updatePayload: any = {
                lecturerId: payload.lecturerId,
                dayOfWeek: payload.dayOfWeek,
                startTime: payload.startTime,
                endTime: payload.endTime,
                location: payload.location,
                capacity: payload.capacity
            };

            await adminCourseSemesterApi.update(params.id, updatePayload);
            toast.success("Schedule updated successfully");
            router.push("/admin/management/course-semester");
            router.refresh();
        } catch (error: any) {
            const msg = error?.response?.data?.message || error.message || "Failed to update schedule";
            toast.error(msg);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Edit Course Schedule"
                description={`Edit details for schedule`}
                backUrl="/admin/management/course-semester"
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
