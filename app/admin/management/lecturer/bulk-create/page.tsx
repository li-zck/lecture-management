"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BulkCreatePage } from "@/components/admin/bulk-create";
import { lecturerBulkConfig } from "@/components/admin/bulk-create";
import { adminLecturerApi } from "@/lib/api/admin-lecturer";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/shadcn/button";

export default function BulkCreateLecturerPage() {
	const router = useRouter();

	const handleSubmit = async (data: Record<string, unknown>[]) => {
		const result = await adminLecturerApi.createMultiple(
			data as unknown as Parameters<typeof adminLecturerApi.createMultiple>[0],
		);
		return { created: result.created };
	};

	const handleSuccess = () => {
		router.push("/admin/management/lecturer");
		router.refresh();
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/admin/management/lecturer">
						<ArrowLeft className="h-4 w-4" />
					</Link>
				</Button>
				<PageHeader
					title="Bulk Create Lecturers"
					description="Create multiple lecturer accounts at once using CSV upload, manual entry, or paste from spreadsheet."
				/>
			</div>

			<BulkCreatePage
				config={lecturerBulkConfig}
				onSubmit={handleSubmit}
				onSuccess={handleSuccess}
			/>
		</div>
	);
}
