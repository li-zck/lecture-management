"use client";

import { Plus, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useStudents } from "@/components/ui/hooks/use-students";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/shadcn/button";
import { DataTable } from "@/components/ui/table/DataTable";
import { adminStudentApi, type StudentAdmin } from "@/lib/api/admin-student";

import { columns } from "./columns";

export default function StudentManagementPage() {
	const { students, loading, refetch } = useStudents();
	const router = useRouter();

	const handleBulkDelete = async (
		selectedItems: StudentAdmin[],
		onSuccess?: () => void,
	) => {
		try {
			const ids = selectedItems.map((item) => item.id);
			await adminStudentApi.deleteMultiple(ids);
			toast.success(`Successfully deleted ${selectedItems.length} student(s)`);
			refetch();
			router.refresh();
			onSuccess?.();
		} catch (error: unknown) {
			const err = error as { message?: string };
			toast.error(err?.message || "Failed to delete students");
		}
	};

	return (
		<div className="space-y-6">
			<PageHeader
				title="Students"
				description="Manage student accounts, view details, and enrollments."
				action={
					<div className="flex gap-2">
						<Button variant="outline" asChild>
							<Link href="/admin/management/student/bulk-create">
								<Upload className="mr-2 h-4 w-4" />
								Bulk Create
							</Link>
						</Button>
						<Button asChild>
							<Link href="/admin/management/student/create">
								<Plus className="mr-2 h-4 w-4" />
								Create New Student
							</Link>
						</Button>
					</div>
				}
			/>

			{loading ? (
				<div className="flex items-center justify-center p-8">
					<div className="text-muted-foreground">Loading specific data...</div>
				</div>
			) : (
				<DataTable
					columns={columns}
					data={students}
					entityType="student"
					filterColumn="fullName"
					bulkDeleteHandlerAction={handleBulkDelete}
				/>
			)}
		</div>
	);
}
