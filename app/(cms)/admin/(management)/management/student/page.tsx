"use client";

import { Button } from "@/components/ui";
import { useStudents } from "@/components/ui/hooks/use-students";
import { Spinner } from "@/components/ui/shadcn/spinner";
import { studentColumns } from "@/components/ui/table/columns";
import { DataTable } from "@/components/ui/table/DataTable";
import { DataTableSkeleton } from "@/components/ui/table/DataTableSkeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function StudentManagementPage() {
	const { students, totalStudents, loading } = useStudents();

	return (
		<div className="min-h-screen p-6">
			<div className="max-w-4xl mx-auto">
				<Link href="/admin/management">
					<Button size="icon" className="mb-6">
						<ArrowLeft />
					</Button>
				</Link>
				<h1 className="text-2xl font-bold mb-6">Student Management</h1>

				<div className="mb-8">
					<h2 className="text-lg font-semibold mb-2">Total Students</h2>
					<p className="text-3xl font-bold">
						{loading ? <Spinner /> : totalStudents}
					</p>
				</div>

				<div className="mb-20">
					<Link href="/admin/management/student/create">
						<Button variant="outline">Create New Student</Button>
					</Link>
				</div>

				{loading ? (
					<DataTableSkeleton rows={5} columns={5} />
				) : (
					<DataTable columns={studentColumns} data={students} />
				)}
			</div>
		</div>
	);
}
