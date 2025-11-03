"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeleteConfirmation } from "@/components/ui/hooks/use-delete-confirmation";
import { useLecturers } from "@/components/ui/hooks/use-lecturer";
import { Button } from "@/components/ui/shadcn/button";
import { Spinner } from "@/components/ui/shadcn/spinner";
import { lecturerColumns } from "@/components/ui/table/columns";
import { DataTable } from "@/components/ui/table/DataTable";
import { DataTableSkeleton } from "@/components/ui/table/DataTableSkeleton";
import {
	deleteLecturerById,
	deleteMultipleLecturers,
} from "@/lib/admin/api/delete/method";

export default function LecturerManagementPage() {
	const { lecturers, totalLecturers, loading } = useLecturers();
	const router = useRouter();
	const { createDeleteHandler, createBulkDeleteHandler, deleteDialog } =
		useDeleteConfirmation();

	const deleteHandler = createDeleteHandler(deleteLecturerById, "Lecturer");
	const bulkDeleteHandler = createBulkDeleteHandler(
		deleteMultipleLecturers,
		"Lecturer",
	);

	return (
		<div className="min-h-screen p-6">
			<div className="max-w-4xl mx-auto">
				<Button size="icon" className="mb-6" onClick={() => router.back()}>
					<ArrowLeft />
				</Button>

				<h1 className="text-2xl font-bold mb-6">Lecturer Management</h1>

				<div className="mb-8">
					<h2 className="text-lg font-semibold mb-2">Total Lecturers</h2>
					<p className="text-3xl font-bold">
						{loading ? <Spinner /> : totalLecturers}
					</p>
				</div>

				<div className="mb-20">
					<Link href="/admin/management/lecturer/create">
						<Button variant="outline">Create New Lecturer</Button>
					</Link>
				</div>

				{loading ? (
					<DataTableSkeleton rows={5} columns={5} />
				) : (
					<DataTable
						columns={lecturerColumns(router, deleteHandler)}
						data={lecturers}
						entityType="lecturer"
						bulkDeleteHandlerAction={bulkDeleteHandler}
					/>
				)}
				{deleteDialog}
			</div>
		</div>
	);
}
