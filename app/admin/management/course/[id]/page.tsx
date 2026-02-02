"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminCourseApi } from "@/lib/api/admin-course";
import { getErrorInfo, logError } from "@/lib/api/error";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { CourseForm } from "../_components/course-form";

interface EditCoursePageProps {
	params: Promise<{
		id: string;
	}>;
}

const getCourseErrorMessage = (status: number, fallback: string): string => {
	const messages: Record<number, string> = {
		400: "Please check the course information and try again.",
		404: "Course not found.",
		409: "A course with this ID already exists.",
		422: "Some course information is invalid. Please review the form.",
	};
	return messages[status] || fallback;
};

export default function EditCoursePage({ params }: EditCoursePageProps) {
	const { id } = use(params);
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [initialValues, setInitialValues] = useState<any>(null);

	useEffect(() => {
		async function fetchCourse() {
			try {
				const data = await adminCourseApi.getById(id);
				setInitialValues(data);
			} catch (error) {
				logError(error, "Fetch Course");
				toast.error("Failed to load course data");
				router.push("/admin/management/course");
			} finally {
				setLoading(false);
			}
		}
		fetchCourse();
	}, [id, router]);

	const handleSubmit = async (values: any) => {
		try {
			await adminCourseApi.update(id, values);
			toast.success("Course updated successfully");
			router.push("/admin/management/course");
			router.refresh();
		} catch (error: unknown) {
			const { status, message } = getErrorInfo(error);
			logError(error, "Update Course");
			toast.error(getCourseErrorMessage(status, message));
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="space-y-6">
			<PageHeader
				title="Edit Course"
				description={`Edit details for ${initialValues?.name || "Course"}`}
			/>
			{initialValues && (
				<CourseForm
					onSubmit={handleSubmit}
					mode="edit"
					initialValues={initialValues}
				/>
			)}
		</div>
	);
}
