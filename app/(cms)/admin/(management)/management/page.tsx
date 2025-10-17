"use client";

import { Button } from "@/components/ui/shadcn/button";
import Link from "next/link";
import {
	useStudents,
	useLecturers,
	useDepartments,
} from "@/components/ui/hooks";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ManagementPage() {
	const router = useRouter();
	const { totalStudents } = useStudents();
	const { totalLecturers } = useLecturers();
	const { totalDepartments } = useDepartments();

	return (
		<div className="">
			<div className="ml-6 mt-10">
				<Button size="icon" className="mb-6" onClick={() => router.back()}>
					<ArrowLeft />
				</Button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
				<div className="rounded-lg shadow p-6">
					<h3 className="text-lg font-medium mb-2">Students</h3>
					<Link href="/admin/management/student">
						<Button className="font-bold">Total: {totalStudents}</Button>
					</Link>
				</div>

				<div className="rounded-lg shadow p-6">
					<h3 className="text-lg font-medium mb-2">Lecturers</h3>
					<Link href="/admin/management/lecturer">
						<Button className="font-bold">Total: {totalLecturers}</Button>
					</Link>
				</div>

				<div className="rounded-lg shadow p-6">
					<h3 className="text-lg font-medium mb-2">Departments</h3>
					<Link href="/admin/management/department">
						<Button className="font-bold">Total: {totalDepartments}</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
