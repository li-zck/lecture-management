"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/shadcn/alert-dialog";
import { Badge } from "@/components/ui/shadcn/badge";
import { Button } from "@/components/ui/shadcn/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { DataTableColumnHeader } from "@/components/ui/table/DataTableColumnHeader";
import {
	adminEnrollmentSessionApi,
	type EnrollmentSession,
} from "@/lib/api/admin-enrollment-session";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const ActionCell = ({ session }: { session: EnrollmentSession }) => {
	const router = useRouter();
	const [openDelete, setOpenDelete] = useState(false);

	const handleDelete = async () => {
		try {
			await adminEnrollmentSessionApi.delete(session.id);
			toast.success("Enrollment session deleted successfully");
			router.refresh();
			window.location.reload();
		} catch {
			toast.error("Failed to delete enrollment session");
		}
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem
						onClick={() =>
							router.push(`/admin/management/enrollment-session/${session.id}`)
						}
					>
						<Pencil className="mr-2 h-4 w-4" />
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => setOpenDelete(true)}
						className="text-red-600 focus:text-red-600"
					>
						<Trash className="mr-2 h-4 w-4" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							enrollment session.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={(e) => {
								e.preventDefault();
								handleDelete();
							}}
							className="bg-red-600 hover:bg-red-700"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

function getSessionStatus(session: EnrollmentSession): {
	label: string;
	variant: "default" | "secondary" | "destructive" | "outline";
} {
	const now = new Date();
	const start = new Date(session.startDate);
	const end = new Date(session.endDate);

	if (!session.isActive) {
		return { label: "Inactive", variant: "secondary" };
	}

	if (now < start) {
		return { label: "Scheduled", variant: "outline" };
	}

	if (now >= start && now <= end) {
		return { label: "Open", variant: "default" };
	}

	return { label: "Closed", variant: "destructive" };
}

export const columns: ColumnDef<EnrollmentSession>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Session Name" />
		),
		cell: ({ row }) => <div>{row.getValue("name") || "Unnamed Session"}</div>,
	},
	{
		accessorKey: "semester.name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Semester" />
		),
		cell: ({ row }) => <div>{row.original.semester?.name || "Unknown"}</div>,
	},
	{
		accessorKey: "startDate",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Start Date" />
		),
		cell: ({ row }) => (
			<div>{format(new Date(row.getValue("startDate")), "PPP p")}</div>
		),
	},
	{
		accessorKey: "endDate",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="End Date" />
		),
		cell: ({ row }) => (
			<div>{format(new Date(row.getValue("endDate")), "PPP p")}</div>
		),
	},
	{
		accessorKey: "isActive",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Status" />
		),
		cell: ({ row }) => {
			const status = getSessionStatus(row.original);
			return <Badge variant={status.variant}>{status.label}</Badge>;
		},
	},
	{
		id: "actions",
		cell: ({ row }) => <ActionCell session={row.original} />,
	},
];
