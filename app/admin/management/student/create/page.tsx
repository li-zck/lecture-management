"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminStudentApi } from "@/lib/api/admin-student";
import { getErrorInfo, logError } from "@/lib/api/error";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StudentForm } from "../_components/student-form";

const getStudentErrorMessage = (
	status: number,
	backendMessage: string,
): string => {
	// For 409 conflicts, use the backend message which is more specific
	// (e.g., "Email already exists" or "Username already exists")
	if (status === 409 && backendMessage) {
		return backendMessage;
	}

	const messages: Record<number, string> = {
		400: "Please check the student information and try again.",
		409: "A student with this ID or email already exists.",
		422: "Some student information is invalid. Please review the form.",
	};
	return messages[status] || backendMessage;
};

export default function CreateStudentPage() {
	const router = useRouter();

	const handleSubmit = async (values: any) => {
		try {
			// Filter out empty string and null values for optional fields
			// Backend validation requires non-empty values if field is provided
			const payload = Object.fromEntries(
				Object.entries(values).filter(
					([, value]) => value !== "" && value !== null,
				),
			);

			// Debug: Log the payload being sent
			console.log("[Create Student] Payload:", payload);

			await adminStudentApi.create(payload as typeof values);
			toast.success("Student created successfully");
			router.push("/admin/management/student");
			router.refresh();
		} catch (error: unknown) {
			const { status, message } = getErrorInfo(error);
			logError(error, "Create Student");
			toast.error(getStudentErrorMessage(status, message));
		}
	};

	return (
		<div className="space-y-6">
			<PageHeader
				title="Create Student"
				description="Add a new student to the system"
			/>
			<StudentForm onSubmit={handleSubmit} mode="create" />
		</div>
	);
}
