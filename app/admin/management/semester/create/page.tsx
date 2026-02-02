"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminSemesterApi } from "@/lib/api/admin-semester";
import { getErrorInfo, logError } from "@/lib/api/error";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SemesterForm } from "../_components/semester-form";

const getSemesterErrorMessage = (status: number, fallback: string): string => {
	const messages: Record<number, string> = {
		400: "Please check the semester dates and try again.",
		409: "A semester with this ID already exists.",
		422: "Some semester information is invalid. Please review the form.",
	};
	return messages[status] || fallback;
};

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
		} catch (error: unknown) {
			const { status, message } = getErrorInfo(error);
			logError(error, "Create Semester");
			toast.error(getSemesterErrorMessage(status, message));
		}
	};

	return (
		<div className="space-y-6">
			<PageHeader
				title="Create Semester"
				description="Add a new semester to the system"
			/>
			<SemesterForm onSubmit={handleSubmit} mode="create" />
		</div>
	);
}
