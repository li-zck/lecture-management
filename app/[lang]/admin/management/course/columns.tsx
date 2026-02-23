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
import { queryKeys } from "@/lib/query";
import { useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { adminCourseApi, type Course } from "@/lib/api/admin-course";

const ActionCell = ({ course }: { course: Course }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [openDelete, setOpenDelete] = useState(false);

  const handleDelete = async () => {
    try {
      await adminCourseApi.delete(course.id);
      await queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
      toast.success("Course deleted successfully");
      router.refresh();
    } catch {
      toast.error("Failed to delete course");
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
            onClick={() => router.push(`/admin/management/course/${course.id}`)}
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
              course.
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

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "name",
    meta: { label: "Course name" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "credits",
    meta: { label: "Credits" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Credits" />
    ),
  },
  {
    id: "offeredIn",
    accessorFn: (row) =>
      row.courseOnSemesters?.map((c) => c.semester.name).join(", ") ?? "",
    meta: { label: "Offered in" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Offered in" />
    ),
    cell: ({ row }) => {
      const names = row.original.courseOnSemesters?.map((c) => c.semester.name);
      return <span>{names?.length ? names.join(", ") : "—"}</span>;
    },
  },
  {
    accessorKey: "recommendedSemester",
    meta: { label: "Recommended level" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Recommended level" />
    ),
    cell: ({ row }) => (
      <span>{row.original.recommendedSemester?.trim() || "—"}</span>
    ),
  },
  {
    accessorKey: "department.name",
    meta: { label: "Department" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),
    cell: ({ row }) => <div>{row.original.department?.name || "N/A"}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell course={row.original} />,
  },
];
