"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminDepartmentApi } from "@/lib/api/admin-department";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DepartmentForm } from "../_components/department-form";

interface EditDepartmentPageProps {
    params: {
        id: string;
    };
}

export default function EditDepartmentPage({ params }: EditDepartmentPageProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState<any>(null);

    useEffect(() => {
        async function fetchDepartment() {
            try {
                const data = await adminDepartmentApi.getById(params.id);
                // API might return head: { id, fullName }, form needs headId
                const formValues = {
                    ...data,
                    headId: data.head?.id || data.headId
                };
                setInitialValues(formValues);
            } catch (error) {
                toast.error("Failed to load department data");
                router.push("/admin/management/department");
            } finally {
                setLoading(false);
            }
        }
        fetchDepartment();
    }, [params.id, router]);

    const handleSubmit = async (values: any) => {
        try {
            const payload = { ...values };
            if (payload.headId === "none" || !payload.headId) {
                payload.headId = null; // API expects null to remove head?
                // Check admin-department.ts UpdateDepartmentRequest: headId?: string | null;
            }

            await adminDepartmentApi.update(params.id, payload);
            toast.success("Department updated successfully");
            router.push("/admin/management/department");
            router.refresh();
        } catch (error: any) {
            const msg = error?.response?.data?.message || error.message || "Failed to update department";
            toast.error(msg);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Edit Department"
                description={`Edit details for ${initialValues?.name || 'Department'}`}
                backUrl="/admin/management/department"
            />
            {initialValues && (
                <DepartmentForm
                    onSubmit={handleSubmit}
                    mode="edit"
                    initialValues={initialValues}
                />
            )}
        </div>
    );
}
