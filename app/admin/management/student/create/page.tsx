"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminStudentApi } from "@/lib/api/admin-student";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StudentForm } from "../_components/student-form";

export default function CreateStudentPage() {
    const router = useRouter();

    const handleSubmit = async (values: any) => {
        try {
            await adminStudentApi.create(values);
            toast.success("Student created successfully");
            router.push("/admin/management/student");
            router.refresh();
        } catch (error: any) {
            const msg = error?.response?.data?.message || error.message || "Failed to create student";
            toast.error(msg);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Create Student"
                description="Add a new student to the system"
                backUrl="/admin/management/student"
            />
            <StudentForm onSubmit={handleSubmit} mode="create" />
        </div>
    );
}

