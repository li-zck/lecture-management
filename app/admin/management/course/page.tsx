"use client";

import { useCourses } from "@/components/ui/hooks/use-courses";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/shadcn/button";
import { DataTable } from "@/components/ui/table/DataTable";
import { adminCourseApi, type Course } from "@/lib/api/admin-course";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { columns } from "./columns";

export default function CourseManagementPage() {
	const { courses, loading, refetch } = useCourses();
	const router = useRouter();

	const handleBulkDelete = async (
		selectedItems: Course[],
		onSuccess?: () => void,
	) => {
		try {
			const ids = selectedItems.map((item) => item.id);
			await adminCourseApi.deleteMultiple(ids);
			toast.success(`Successfully deleted ${selectedItems.length} course(s)`);
			refetch();
			router.refresh();
			onSuccess?.();
		} catch (error: unknown) {
			const err = error as { message?: string };
			toast.error(err?.message || "Failed to delete courses");
		}
	};

	return (
		<div className="space-y-6">
			<PageHeader
				title="Courses"
				description="Manage courses, credits, and department assignments."
				action={
					<Button asChild>
						<Link href="/admin/management/course/create">
							<Plus className="mr-2 h-4 w-4" />
							Create New Course
						</Link>
					</Button>
				}
			/>

			{loading ? (
				<div className="flex items-center justify-center p-8">
					<div className="text-muted-foreground">Loading specific data...</div>
				</div>
			) : (
				<DataTable
					columns={columns}
					data={courses}
					entityType="course"
					filterColumn="name"
					bulkDeleteHandlerAction={handleBulkDelete}
				/>
			)}
		</div>
	);
}
