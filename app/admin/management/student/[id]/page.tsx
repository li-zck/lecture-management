"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminStudentApi } from "@/lib/api/admin-student";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { StudentForm } from "../_components/student-form";

interface EditStudentPageProps {
    params: {
        id: string;
    };
}

export default function EditStudentPage({ params }: EditStudentPageProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState<any>(null);

    useEffect(() => {
        async function fetchStudent() {
            try {
                const data = await adminStudentApi.getById(params.id);
                // Flatten departmentId if needed, though form handles it via defaultValues mapping
                setInitialValues(data);
            } catch (error) {
                toast.error("Failed to load student data");
                router.push("/admin/management/student");
            } finally {
                setLoading(false);
            }
        }
        fetchStudent();
    }, [params.id, router]);

    const handleSubmit = async (values: any) => {
        try {
            // Remove empty password if not changed handled by API? 
            // The API expects 'password' string. If empty string sent, check backend.
            // backend hashPassword usually hashes empty string if not careful.
            // But form logic or API logic should strip it.
            // Let's strip empties here.

            const payload = { ...values };
            if (!payload.password) {
                delete payload.password;
            }

            await adminStudentApi.update(params.id, payload);
            toast.success("Student updated successfully");
            router.push("/admin/management/student");
            router.refresh();
        } catch (error: any) {
            const msg = error?.response?.data?.message || error.message || "Failed to update student";
            toast.error(msg);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Edit Student"
                description={`Edit details for ${initialValues?.fullName || 'Student'}`}
                backUrl="/admin/management/student"
            />
            {initialValues && (
                <StudentForm
                    onSubmit={handleSubmit}
                    mode="edit"
                    initialValues={initialValues}
                />
            )}
        </div>
    );
}
