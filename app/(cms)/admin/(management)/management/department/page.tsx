"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeleteConfirmation } from "@/components/ui/hooks/use-delete-confirmation";
import { useDepartments } from "@/components/ui/hooks/use-department";
import { Button } from "@/components/ui/shadcn/button";
import { Spinner } from "@/components/ui/shadcn/spinner";
import { departmentColumns } from "@/components/ui/table/columns";
import { DataTable } from "@/components/ui/table/DataTable";
import { DataTableSkeleton } from "@/components/ui/table/DataTableSkeleton";
import {
	deleteDepartmentById,
	deleteMultipleDepartments,
} from "@/lib/admin/api/delete/method";

export default function DepartmentManagementPage() {
	const { departments, totalDepartments, loading } = useDepartments();
	const router = useRouter();
	const { createDeleteHandler, createBulkDeleteHandler, deleteDialog } =
		useDeleteConfirmation();

	const deleteHandler = createDeleteHandler(deleteDepartmentById, "Department");
	const bulkDeleteHandler = createBulkDeleteHandler(
		deleteMultipleDepartments,
		"Department",
	);

	return (
		<div className="min-h-screen p-6">
			<div className="max-w-4xl mx-auto">
				<Button size="icon" className="mb-6" onClick={() => router.back()}>
					<ArrowLeft />
				</Button>

				<h1 className="text-2xl font-bold mb-6">Department Management</h1>

				<div className="mb-8">
					<h2 className="text-lg font-semibold mb-2">Total Departments</h2>
					<p className="text-3xl font-bold">
						{loading ? <Spinner /> : totalDepartments}
					</p>
				</div>

				<div className="mb-20">
					<Link href="/admin/management/department/create">
						<Button variant="outline">Create New Department</Button>
					</Link>
				</div>

				{loading ? (
					<DataTableSkeleton rows={5} columns={4} />
				) : (
					<DataTable
						columns={departmentColumns(router, deleteHandler)}
						data={departments}
						filterColumn="name"
						entityType="department"
						bulkDeleteHandlerAction={bulkDeleteHandler}
					/>
				)}
				{deleteDialog}
			</div>
		</div>
	);
}
