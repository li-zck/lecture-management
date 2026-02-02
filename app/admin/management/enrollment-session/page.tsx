"use client";

import { useEnrollmentSessions } from "@/components/ui/hooks/use-enrollment-sessions";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/shadcn/button";
import { DataTable } from "@/components/ui/table/DataTable";
import {
	adminEnrollmentSessionApi,
	type EnrollmentSession,
} from "@/lib/api/admin-enrollment-session";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { columns } from "./columns";

export default function EnrollmentSessionManagementPage() {
	const { enrollmentSessions, loading, refetch } = useEnrollmentSessions();
	const router = useRouter();

	const handleBulkDelete = async (
		selectedItems: EnrollmentSession[],
		onSuccess?: () => void,
	) => {
		try {
			const ids = selectedItems.map((item) => item.id);
			await adminEnrollmentSessionApi.deleteMultiple(ids);
			toast.success(
				`Successfully deleted ${selectedItems.length} enrollment session(s)`,
			);
			refetch();
			router.refresh();
			onSuccess?.();
		} catch (error: unknown) {
			const err = error as { message?: string };
			toast.error(err?.message || "Failed to delete enrollment sessions");
		}
	};

	return (
		<div className="space-y-6">
			<PageHeader
				title="Enrollment Sessions"
				description="Manage enrollment periods when students can register for courses. Control when enrollment is open or closed."
				action={
					<Button asChild>
						<Link href="/admin/management/enrollment-session/create">
							<Plus className="mr-2 h-4 w-4" />
							Create New Session
						</Link>
					</Button>
				}
			/>

			{loading ? (
				<div className="flex items-center justify-center p-8">
					<div className="text-muted-foreground">
						Loading enrollment sessions...
					</div>
				</div>
			) : (
				<DataTable
					columns={columns}
					data={enrollmentSessions}
					entityType="enrollment-session"
					filterColumn="name"
					bulkDeleteHandlerAction={handleBulkDelete}
				/>
			)}
		</div>
	);
}
