"use client";

import Link from "next/link";

import {
	useAdmins,
	useDepartments,
	useLecturers,
	useStudents,
} from "@/components/ui/hooks";
import { Button } from "@/components/ui/shadcn/button";

interface ManagementCard {
	href: string;
	label: string;
	total: number;
	icon?: string;
}

export default function ManagementPage() {
	const { totalStudents } = useStudents();
	const { totalLecturers } = useLecturers();
	const { totalDepartments } = useDepartments();
	const { totalAdmins } = useAdmins();

	const cards: ManagementCard[] = [
		{
			href: "/admin/management/student",
			label: "Students",
			total: totalStudents,
		},
		{
			href: "/admin/management/lecturer",
			label: "Lecturers",
			total: totalLecturers,
		},
		{
			href: "/admin/management/department",
			label: "Departments",
			total: totalDepartments,
		},
		{
			href: "/admin/management/admin",
			label: "Admins",
			total: totalAdmins,
		},
	];

	return (
		<div className="space-y-8 p-6">
			<div>
				<h1 className="text-3xl font-bold">Management</h1>
				<p className="text-foreground/60">
					Manage students, lecturers, departments, and admins
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{cards.map((card) => (
					<Link key={card.href} href={card.href}>
						<div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow h-full">
							<h3 className="text-lg font-semibold mb-4">{card.label}</h3>
							<div className="text-3xl font-bold text-primary mb-4">
								{card.total}
							</div>
							<Button variant="outline" className="w-full">
								View All
							</Button>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
