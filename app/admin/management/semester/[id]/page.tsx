"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminSemesterApi } from "@/lib/api/admin-semester";
import { getErrorInfo, logError } from "@/lib/api/error";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { SemesterForm } from "../_components/semester-form";

interface EditSemesterPageProps {
	params: Promise<{
		id: string;
	}>;
}

const getSemesterErrorMessage = (status: number, fallback: string): string => {
	const messages: Record<number, string> = {
		400: "Please check the semester dates and try again.",
		404: "Semester not found.",
		409: "A semester with this ID already exists.",
		422: "Some semester information is invalid. Please review the form.",
	};
	return messages[status] || fallback;
};

export default function EditSemesterPage({ params }: EditSemesterPageProps) {
	const { id } = use(params);
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [initialValues, setInitialValues] = useState<any>(null);

	useEffect(() => {
		async function fetchSemester() {
			try {
				const data = await adminSemesterApi.getById(id);
				setInitialValues(data);
			} catch (error) {
				logError(error, "Fetch Semester");
				toast.error("Failed to load semester data");
				router.push("/admin/management/semester");
			} finally {
				setLoading(false);
			}
		}
		fetchSemester();
	}, [id, router]);

	const handleSubmit = async (values: any) => {
		try {
			const payload = {
				...values,
				startDate: new Date(values.startDate).toISOString(),
				endDate: new Date(values.endDate).toISOString(),
			};

			await adminSemesterApi.update(id, payload);
			toast.success("Semester updated successfully");
			router.push("/admin/management/semester");
			router.refresh();
		} catch (error: unknown) {
			const { status, message } = getErrorInfo(error);
			logError(error, "Update Semester");
			toast.error(getSemesterErrorMessage(status, message));
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="space-y-6">
			<PageHeader
				title="Edit Semester"
				description={`Edit details for ${initialValues?.name || "Semester"}`}
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
