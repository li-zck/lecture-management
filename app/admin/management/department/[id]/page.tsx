"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminDepartmentApi } from "@/lib/api/admin-department";
import { getErrorInfo, logError } from "@/lib/api/error";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { DepartmentForm } from "../_components/department-form";

interface EditDepartmentPageProps {
	params: Promise<{
		id: string;
	}>;
}

const getDepartmentErrorMessage = (
	status: number,
	fallback: string,
): string => {
	const messages: Record<number, string> = {
		400: "Please check the department information and try again.",
		404: "Department not found.",
		409: "A department with this ID already exists.",
		422: "Some department information is invalid. Please review the form.",
	};
	return messages[status] || fallback;
};

export default function EditDepartmentPage({
	params,
}: EditDepartmentPageProps) {
	const { id } = use(params);
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [initialValues, setInitialValues] = useState<any>(null);
	const hasShownErrorRef = useRef(false);

	useEffect(() => {
		async function fetchDepartment() {
			try {
				const data = await adminDepartmentApi.getById(id);
				const formValues = {
					...data,
					headId: data.head?.id || data.headId,
				};
				setInitialValues(formValues);
			} catch (error) {
				logError(error, "Fetch Department");
				if (!hasShownErrorRef.current) {
					toast.error("Failed to load department data");
					hasShownErrorRef.current = true;
				}
				router.push("/admin/management/department");
			} finally {
				setLoading(false);
			}
		}
		fetchDepartment();
	}, [id, router]);

	const handleSubmit = async (values: any) => {
		try {
			// Don't send departmentId in update - it can't be changed
			const { departmentId, ...rest } = values;
			const payload = { ...rest };
			if (payload.headId === "none" || !payload.headId) {
				payload.headId = null;
			}

			await adminDepartmentApi.update(id, payload);
			toast.success("Department updated successfully");
			router.push("/admin/management/department");
			router.refresh();
		} catch (error: unknown) {
			const { status, message } = getErrorInfo(error);
			logError(error, "Update Department");
			toast.error(getDepartmentErrorMessage(status, message));
		}
	};

	const handleDelete = async () => {
		try {
			await adminDepartmentApi.delete(id);
			toast.success("Department deleted successfully");
			router.push("/admin/management/department");
			router.refresh();
		} catch (error: unknown) {
			const { status, message } = getErrorInfo(error);
			logError(error, "Delete Department");

			// Show the actual error message from the backend
			if (message && message !== "An error occurred") {
				toast.error(message);
			} else if (status === 404) {
				toast.error("Department not found");
			} else if (status === 409) {
				toast.error(
					"Cannot delete department: It has related records. Please remove them first.",
				);
			} else {
				toast.error("Failed to delete department");
			}
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="space-y-6">
			<PageHeader
				title="Edit Department"
				description={`Edit details for ${initialValues?.name || "Department"}`}
			/>
			{initialValues && (
				<DepartmentForm
					key={id}
					onSubmit={handleSubmit}
					onDelete={handleDelete}
					mode="edit"
					initialValues={initialValues}
				/>
			)}
		</div>
	);
}
