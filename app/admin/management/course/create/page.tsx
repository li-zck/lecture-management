"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminCourseApi } from "@/lib/api/admin-course";
import { getErrorInfo, logError } from "@/lib/api/error";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CourseForm } from "../_components/course-form";

const getCourseErrorMessage = (status: number, fallback: string): string => {
	const messages: Record<number, string> = {
		400: "Please check the course information and try again.",
		409: "A course with this ID already exists.",
		422: "Some course information is invalid. Please review the form.",
	};
	return messages[status] || fallback;
};

export default function CreateCoursePage() {
	const router = useRouter();

	const handleSubmit = async (values: any) => {
		try {
			await adminCourseApi.create(values);
			toast.success("Course created successfully");
			router.push("/admin/management/course");
			router.refresh();
		} catch (error: unknown) {
			const { status, message } = getErrorInfo(error);
			logError(error, "Create Course");
			toast.error(getCourseErrorMessage(status, message));
		}
	};

	return (
		<div className="space-y-6">
			<PageHeader
				title="Create Course"
				description="Add a new course to the system"
			/>
			<CourseForm onSubmit={handleSubmit} mode="create" />
		</div>
	);
}
