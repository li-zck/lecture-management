"use client";

import { StudentAdmin, adminStudentApi } from "@/lib/api/admin-student";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/shadcn/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { DataTableColumnHeader } from "@/components/ui/table/DataTableColumnHeader";
import { useState } from "react";
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

const ActionCell = ({ student }: { student: StudentAdmin }) => {
    const router = useRouter();
    const [openDelete, setOpenDelete] = useState(false);

    const handleDelete = async () => {
        try {
            await adminStudentApi.delete(student.id);
            toast.success("Student deleted successfully");
            router.refresh(); // Refresh data
            // Note: In a real app with SWR/React Query, we'd invalidate the query.
            // Since we use basic fetch, router.refresh() re-runs server components,
            // but for client components fetching data, we might need a context refresh.
            // For now, simple reload or parent refresh key is needed.
            window.location.reload();
        } catch (error) {
            toast.error("Failed to delete student");
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
                        onClick={() => router.push(`/admin/management/student/${student.id}`)}
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
                            This action cannot be undone. This will permanently delete the student account.
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

export const columns: ColumnDef<StudentAdmin>[] = [
    {
        accessorKey: "studentId",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Student ID" />
        ),
        cell: ({ row }) => <div className="w-[100px]">{row.getValue("studentId")}</div>,
    },
    {
        accessorKey: "fullName",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Full Name" />
        ),
    },
    {
        accessorKey: "username",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Username" />
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
    },
    {
        accessorKey: "department.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Department" />
        ),
        cell: ({ row }) => {
            const department = row.original.department;
            return <div className="w-[150px]">{department?.name || "N/A"}</div>;
        },
    },
    {
        accessorKey: "active",
        header: "Status",
        cell: ({ row }) => (
            <div className={row.original.active ? "text-green-600" : "text-red-600"}>
                {row.original.active ? "Active" : "Inactive"}
            </div>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => <ActionCell student={row.original} />,
    },
];

