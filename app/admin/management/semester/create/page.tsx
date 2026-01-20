"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminSemesterApi } from "@/lib/api/admin-semester";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SemesterForm } from "../_components/semester-form";

export default function CreateSemesterPage() {
    const router = useRouter();

    const handleSubmit = async (values: any) => {
        try {
            // Ensure dates are ISO strings
            const payload = {
                ...values,
                startDate: new Date(values.startDate).toISOString(),
                endDate: new Date(values.endDate).toISOString(),
            };

            await adminSemesterApi.create(payload);
            toast.success("Semester created successfully");
            router.push("/admin/management/semester");
            router.refresh();
        } catch (error: any) {
            const msg = error?.response?.data?.message || error.message || "Failed to create semester";
            toast.error(msg);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Create Semester"
                description="Add a new semester to the system"
                backUrl="/admin/management/semester"
            />
            <SemesterForm onSubmit={handleSubmit} mode="create" />
        </div>
    );
}

