"use client";

import { useDepartments } from "@/components/ui/hooks/use-department";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/shadcn/button";
import { DataTable } from "@/components/ui/table/DataTable";
import {
	adminDepartmentApi,
	type Department,
} from "@/lib/api/admin-department";
import { Plus, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { columns } from "./columns";

export default function DepartmentManagementPage() {
	const { departments, loading, refetch } = useDepartments();
	const router = useRouter();

	const handleBulkDelete = async (
		selectedItems: Department[],
		onSuccess?: () => void,
	) => {
		try {
			const ids = selectedItems.map((item) => item.id);
			await adminDepartmentApi.deleteMultiple(ids);
			toast.success(
				`Successfully deleted ${selectedItems.length} department(s)`,
			);
			refetch();
			router.refresh();
			onSuccess?.();
		} catch (error: unknown) {
			const err = error as { message?: string };
			toast.error(err?.message || "Failed to delete departments");
		}
	};

	return (
		<div className="space-y-6">
			<PageHeader
				title="Departments"
				description="Manage departments and assign heads."
				action={
					<div className="flex gap-2">
						<Button variant="outline" asChild>
							<Link href="/admin/management/department/bulk-create">
								<Upload className="mr-2 h-4 w-4" />
								Bulk Create
							</Link>
						</Button>
						<Button asChild>
							<Link href="/admin/management/department/create">
								<Plus className="mr-2 h-4 w-4" />
								Create New Department
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
					data={departments}
					entityType="department"
					filterColumn="name"
					bulkDeleteHandlerAction={handleBulkDelete}
				/>
			)}
		</div>
	);
}
