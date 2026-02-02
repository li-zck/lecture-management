"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BulkCreatePage } from "@/components/admin/bulk-create";
import { studentBulkConfig } from "@/components/admin/bulk-create";
import { adminStudentApi } from "@/lib/api/admin-student";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/shadcn/button";

export default function BulkCreateStudentPage() {
	const router = useRouter();

	const handleSubmit = async (data: Record<string, unknown>[]) => {
		const result = await adminStudentApi.createMultiple(
			data as unknown as Parameters<typeof adminStudentApi.createMultiple>[0],
		);
		return { created: result.created };
	};

	const handleSuccess = () => {
		router.push("/admin/management/student");
		router.refresh();
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/admin/management/student">
						<ArrowLeft className="h-4 w-4" />
					</Link>
				</Button>
				<PageHeader
					title="Bulk Create Students"
					description="Create multiple student accounts at once using CSV upload, manual entry, or paste from spreadsheet."
				/>
			</div>

			<BulkCreatePage
				config={studentBulkConfig}
				onSubmit={handleSubmit}
				onSuccess={handleSuccess}
			/>
		</div>
	);
}
