"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminCourseSemesterApi } from "@/lib/api/admin-course-semester";
import { getErrorInfo, logError } from "@/lib/api/error";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { CourseSemesterForm } from "../_components/course-semester-form";

interface EditCourseSemesterPageProps {
	params: Promise<{
		id: string;
	}>;
}

const getScheduleErrorMessage = (status: number, fallback: string): string => {
	const messages: Record<number, string> = {
		400: "Please check the schedule information and try again.",
		404: "Schedule not found.",
		409: "This course is already scheduled for this semester.",
		422: "Some schedule information is invalid. Please review the form.",
	};
	return messages[status] || fallback;
};

export default function EditCourseSemesterPage({
	params,
}: EditCourseSemesterPageProps) {
	const { id } = use(params);
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [initialValues, setInitialValues] = useState<any>(null);

	useEffect(() => {
		async function fetchCourseSemester() {
			try {
				const data = await adminCourseSemesterApi.getById(id);
				setInitialValues(data);
			} catch (error) {
				logError(error, "Fetch Course Schedule");
				toast.error("Failed to load schedule data");
				router.push("/admin/management/course-semester");
			} finally {
				setLoading(false);
			}
		}
		fetchCourseSemester();
	}, [id, router]);

	const handleSubmit = async (values: any) => {
		try {
			const payload = { ...values };
			if (payload.lecturerId === "none" || !payload.lecturerId) {
				payload.lecturerId = null;
			}

			const updatePayload: any = {
				lecturerId: payload.lecturerId,
				dayOfWeek: payload.dayOfWeek,
				startTime: payload.startTime,
				endTime: payload.endTime,
				location: payload.location,
				capacity: payload.capacity,
			};

			await adminCourseSemesterApi.update(id, updatePayload);
			toast.success("Schedule updated successfully");
			router.push("/admin/management/course-semester");
			router.refresh();
		} catch (error: unknown) {
			const { status, message } = getErrorInfo(error);
			logError(error, "Update Course Schedule");
			toast.error(getScheduleErrorMessage(status, message));
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="space-y-6">
			<PageHeader
				title="Edit Course Schedule"
				description={`Edit details for schedule`}
			/>
			{initialValues && (
				<CourseSemesterForm
					onSubmit={handleSubmit}
					mode="edit"
					initialValues={initialValues}
				/>
			)}
		</div>
	);
}
