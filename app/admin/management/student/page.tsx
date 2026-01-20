"use client";

import { useStudents } from "@/components/ui/hooks/use-students";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/shadcn/button";
import { DataTable } from "@/components/ui/table/DataTable";
import { Plus } from "lucide-react";
import Link from "next/link";
import { columns } from "./columns";

export default function StudentManagementPage() {
	const { students, loading } = useStudents();

	return (
		<div className="space-y-6">
			<PageHeader
				title="Student Management"
				description="Manage student accounts, view details, and enrollments."
				backUrl="/admin"
				action={
					<Button asChild>
						<Link href="/admin/management/student/create">
							<Plus className="mr-2 h-4 w-4" />
							Create New Student
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
					data={students}
					entityType="student"
					filterColumn="fullName"
				/>
			)}
		</div>
	);
}
