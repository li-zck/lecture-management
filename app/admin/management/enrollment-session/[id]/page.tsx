"use client";

import { useEnrollmentSession } from "@/components/ui/hooks/use-enrollment-sessions";
import { PageHeader } from "@/components/ui/page-header";
import { adminEnrollmentSessionApi } from "@/lib/api/admin-enrollment-session";
import { getErrorInfo, logError } from "@/lib/api/error";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { EnrollmentSessionForm } from "../_components/enrollment-session-form";
import type { CreateEnrollmentSessionFormValues } from "@/lib/zod/schemas/create/enrollment-session";

export default function EditEnrollmentSessionPage() {
	const params = useParams();
	const router = useRouter();
	const id = params.id as string;
	const { enrollmentSession, loading, error } = useEnrollmentSession(id);

	const handleSubmit = async (values: CreateEnrollmentSessionFormValues) => {
		try {
			await adminEnrollmentSessionApi.update(id, {
				...values,
				startDate: new Date(values.startDate).toISOString(),
				endDate: new Date(values.endDate).toISOString(),
			});
			toast.success("Enrollment session updated successfully");
			router.push("/admin/management/enrollment-session");
			router.refresh();
		} catch (err: unknown) {
			const { message } = getErrorInfo(err);
			logError(err, "Update Enrollment Session");
			toast.error(message || "Failed to update enrollment session");
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center p-8">
				<div className="text-muted-foreground">
					Loading enrollment session...
				</div>
			</div>
		);
	}

	if (error || !enrollmentSession) {
		return (
			<div className="flex items-center justify-center p-8">
				<div className="text-destructive">
					Failed to load enrollment session
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<PageHeader
				title="Edit Enrollment Session"
				description={`Editing: ${enrollmentSession.name || "Unnamed Session"}`}
			/>
			<EnrollmentSessionForm
				initialValues={{
					name: enrollmentSession.name ?? "",
					semesterId: enrollmentSession.semesterId,
					startDate: enrollmentSession.startDate,
					endDate: enrollmentSession.endDate,
					isActive: enrollmentSession.isActive,
				}}
				onSubmit={handleSubmit}
				mode="edit"
			/>
		</div>
	);
}
