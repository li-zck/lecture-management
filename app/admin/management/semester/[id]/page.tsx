"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminSemesterApi } from "@/lib/api/admin-semester";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SemesterForm } from "../_components/semester-form";

interface EditSemesterPageProps {
    params: {
        id: string;
    };
}

export default function EditSemesterPage({ params }: EditSemesterPageProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState<any>(null);

    useEffect(() => {
        async function fetchSemester() {
            try {
                const data = await adminSemesterApi.getById(params.id);
                setInitialValues(data);
            } catch (error) {
                toast.error("Failed to load semester data");
                router.push("/admin/management/semester");
            } finally {
                setLoading(false);
            }
        }
        fetchSemester();
    }, [params.id, router]);

    const handleSubmit = async (values: any) => {
        try {
            const payload = {
                ...values,
                startDate: new Date(values.startDate).toISOString(),
                endDate: new Date(values.endDate).toISOString(),
            };

            await adminSemesterApi.update(params.id, payload);
            toast.success("Semester updated successfully");
            router.push("/admin/management/semester");
            router.refresh();
        } catch (error: any) {
            const msg = error?.response?.data?.message || error.message || "Failed to update semester";
            toast.error(msg);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Edit Semester"
                description={`Edit details for ${initialValues?.name || 'Semester'}`}
                backUrl="/admin/management/semester"
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
