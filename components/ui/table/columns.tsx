"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/shadcn/checkbox";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuItem,
	DropdownMenuContent,
} from "@/components/ui/shadcn/dropdown-menu";
import { Button } from "@/components/ui/shadcn/button";
import { MoreHorizontal } from "lucide-react";
import {
	DepartmentResponse,
	LecturerAccountResponse,
	StudentAccountResponse,
} from "@/lib/types/dto/api/admin/response/read/read.dto";
import {
	deleteDepartmentById,
	deleteLecturerById,
	deleteMultipleDepartments,
	deleteMultipleLecturers,
	deleteMultipleStudents,
	deleteStudentById,
} from "@/lib/admin/api/delete/method";
import { toast } from "sonner";
import { EntityWithIds, getEntityId } from "@/lib/utils/idMapping";

const createDeleteHandler = <T extends EntityWithIds>(
	deleteFn: (id: string) => void,
	entityName: string,
) => {
	return async (item: T) => {
		try {
			const internalId = getEntityId(item);

			deleteFn(internalId);

			toast.success(`${entityName} deleted successfully`);

			setTimeout(() => window.location.reload(), 1500);
		} catch (error: any) {
			toast.error(
				error.message || `Failed to delete ${entityName.toLowerCase()}`,
			);
		}
	};
};

const createBulkDeleteHandler = (
	deleteFn: (ids: string[]) => void,
	entityName: string,
) => {
	return async (selectedItems: EntityWithIds[]) => {
		try {
			const internalIds = selectedItems.map((item) => getEntityId(item));

			deleteFn(internalIds);

			toast.success(
				`${selectedItems.length} ${entityName.toLowerCase()}s deleted successfully`,
			);

			setTimeout(() => window.location.reload(), 1500);
		} catch (error: any) {
			toast.error(
				error.message || `Failed to delete ${entityName.toLowerCase()}s`,
			);
		}
	};
};

export const handleDeleteStudent = () =>
	createDeleteHandler(deleteStudentById, "Student");

export const handleBulkDeleteStudents = () =>
	createBulkDeleteHandler(deleteMultipleStudents, "Student");

export const handleDeleteLecturer = () =>
	createDeleteHandler(deleteLecturerById, "Lecturer");

export const handleBulkDeleteLecturers = () =>
	createBulkDeleteHandler(deleteMultipleLecturers, "Lecturer");

export const handleDeleteDepartment = () =>
	createDeleteHandler(deleteDepartmentById, "Department");

export const handleBulkDeleteDepartments = () =>
	createBulkDeleteHandler(deleteMultipleDepartments, "Department");

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
	router: any;
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
					onClick={(e) => e.stopPropagation()}
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
									className={
										action.label === "Delete"
											? "text-red-600 focus:text-red-500"
											: ""
									}
									onClick={(e) => {
										// prevent events bubbling
										e.stopPropagation();
										action.onClick(item);
									}}
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

export const studentColumns = (router: any) =>
	createEntityColumns<StudentAccountResponse>({
		fields: [
			{ key: "studentId", header: "Student ID" },
			{ key: "fullName", header: "Full Name" },
			{ key: "email", header: "Email" },
			{ key: "active", header: "Active" },
		],

		actions: [
			{
				label: "Copy Details",
				onClick: (student) => console.log(`Copying ${student}`),
			},
			{
				label: "Edit",
				onClick: (student) => console.log(`Editing: ${student}`),
			},
			{
				label: "Delete",
				onClick: handleDeleteStudent(),
			},
		],
		router,
	});

export const lecturerColumns = (router: any) =>
	createEntityColumns<LecturerAccountResponse>({
		fields: [
			{ key: "lecturerId", header: "Lecturer ID" },
			{ key: "fullName", header: "Full Name" },
			{ key: "email", header: "Email" },
			{ key: "active", header: "Active" },
		],

		actions: [
			{
				label: "Copy Details",
				onClick: (lecturer) => console.log(`Copying ${lecturer}`),
			},
			{
				label: "Edit",
				onClick: (lecturer) => console.log(`Editing: ${lecturer}`),
			},
			{
				label: "Delete",
				onClick: handleDeleteLecturer(),
			},
		],
		router,
	});

export const departmentColumns = (router: any) =>
	createEntityColumns<DepartmentResponse>({
		fields: [
			{ key: "departmentId", header: "Department ID" },
			{ key: "name", header: "Department name" },
			{ key: "headId", header: "Department head" },
			{ key: "description", header: "Description" },
		],

		actions: [
			{
				label: "Copy Details",
				onClick: (department) => console.log(`Copying ${department}`),
			},
			{
				label: "Edit",
				onClick: (department) => console.log(`Editing: ${department}`),
			},
			{
				label: "Delete",
				onClick: handleDeleteDepartment(),
			},
		],
		router,
	});
