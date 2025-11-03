"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeleteConfirmation } from "@/components/ui/hooks/use-delete-confirmation";
import { useAdmins } from "@/components/ui/hooks/use-admin";
import { Button } from "@/components/ui/shadcn/button";
import { Spinner } from "@/components/ui/shadcn/spinner";
import { adminColumns } from "@/components/ui/table/columns";
import { DataTable } from "@/components/ui/table/DataTable";
import { DataTableSkeleton } from "@/components/ui/table/DataTableSkeleton";
import {
	deleteAdminById,
	deleteMultipleAdmins,
} from "@/lib/admin/api/delete/method";

export default function AdminManagementPage() {
	const { admins, totalAdmins, loading } = useAdmins();
	const router = useRouter();
	const { createDeleteHandler, createBulkDeleteHandler, deleteDialog } =
		useDeleteConfirmation();

	const deleteHandler = createDeleteHandler(deleteAdminById, "Admin");
	const bulkDeleteHandler = createBulkDeleteHandler(
		deleteMultipleAdmins,
		"Admin",
	);

	return (
		<div className="min-h-screen p-6">
			<div className="max-w-4xl mx-auto">
				<Button size="icon" className="mb-6" onClick={() => router.back()}>
					<ArrowLeft />
				</Button>

				<h1 className="text-2xl font-bold mb-6">Admin Management</h1>

				<div className="mb-8">
					<h2 className="text-lg font-semibold mb-2">Total Admins</h2>
					<p className="text-3xl font-bold">
						{loading ? <Spinner /> : totalAdmins}
					</p>
				</div>

				<div className="mb-20">
					<Link href="/admin/management/admin/create">
						<Button variant="outline">Create New Admin</Button>
					</Link>
				</div>

				{loading ? (
					<DataTableSkeleton rows={5} columns={4} />
				) : (
					<DataTable
						columns={adminColumns(router, deleteHandler)}
						data={admins}
						entityType="admin"
						bulkDeleteHandlerAction={bulkDeleteHandler}
					/>
				)}
				{deleteDialog}
			</div>
		</div>
	);
}
