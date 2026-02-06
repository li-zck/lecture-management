"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BulkCreatePage } from "@/components/admin/bulk-create";
import { departmentBulkConfig } from "@/components/admin/bulk-create";
import { adminDepartmentApi } from "@/lib/api/admin-department";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/shadcn/button";

export default function BulkCreateDepartmentPage() {
	const router = useRouter();

	const handleSubmit = async (data: Record<string, unknown>[]) => {
		const result = await adminDepartmentApi.createMultiple(
			data as unknown as Parameters<
				typeof adminDepartmentApi.createMultiple
			>[0],
		);
		return { created: result.created };
	};

	const handleSuccess = () => {
		router.push("/admin/management/department");
		router.refresh();
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/admin/management/department">
						<ArrowLeft className="h-4 w-4" />
					</Link>
				</Button>
				<PageHeader
					title="Bulk Create Departments"
					description="Create multiple departments at once using CSV upload, manual entry, or paste from spreadsheet."
				/>
			</div>

			<BulkCreatePage
				config={departmentBulkConfig}
				onSubmit={handleSubmit}
				onSuccess={handleSuccess}
			/>
		</div>
	);
}
