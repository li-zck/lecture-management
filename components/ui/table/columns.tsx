import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/shadcn/checkbox";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuContent,
	DropdownMenuLabel,
} from "@/components/ui/shadcn/dropdown-menu";
import { Button } from "@/components/ui/shadcn/button";
import { MoreHorizontal } from "lucide-react";
import {
	DepartmentResponse,
	LecturerAccountResponse,
	StudentAccountResponse,
} from "@/lib/types/dto/api/admin/response/read/read-account.dto";

/**
 * Creates column definitions for entity tables with selection and actions
 * @template T - The entity type
 * @param config - Configuration for the columns
 * @returns Array of column definitions
 */
export const createEntityColumns = <
	T extends { id: string; [key: string]: any },
>(config: {
	fields: Array<{
		key: keyof T;
		header: string;
		sortable?: boolean;
	}>;
	actions?: Array<{ label: string; onClick: (item: T) => void }>;
}): ColumnDef<T>[] => {
	const columns: ColumnDef<T>[] = [
		{
			id: "select",
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
				/>
			),
			enableSorting: false,
			enableHiding: false,
		},
		...config.fields.map((field) => ({
			accessorKey: field.key,
			header: field.header,
			enableSorting: field.sortable ?? true,
		})),
		{
			id: "actions",
			cell: ({ row }) => {
				const item = row.original;

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
							{config.actions?.map((action) => (
								<DropdownMenuItem
									key={action.label}
									onClick={() => action.onClick(item)}
								>
									{action.label}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	return columns;
};

export const studentColumns = createEntityColumns<StudentAccountResponse>({
	fields: [
		{ key: "studentId", header: "Student ID" },
		{ key: "fullName", header: "Full Name" },
		{ key: "email", header: "Email" },
		{ key: "active", header: "Active" },
	],

	actions: [
		{
			label: "View Details",
			onClick: (student) => console.log(student),
		},
		{
			label: "Edit",
			onClick(student) {
				console.log("edit");
			},
		},
	],
});

export const lecturerColumns = createEntityColumns<LecturerAccountResponse>({
	fields: [
		{ key: "id", header: "Lecturer ID" },
		{ key: "fullName", header: "Full Name" },
		{ key: "email", header: "Email" },
		{ key: "active", header: "Active" },
	],

	actions: [
		{
			label: "View Profile",
			onClick: (lecturer) => console.log(lecturer),
		},
	],
});

export const departmentColumns = createEntityColumns<DepartmentResponse>({
	fields: [
		{ key: "id", header: "Department ID" },
		{ key: "name", header: "Department name" },
		{ key: "headId", header: "Department head" },
		{ key: "description", header: "Description" },
	],

	actions: [
		{
			label: "View Department",
			onClick: (department) => console.log(department),
		},
	],
});
