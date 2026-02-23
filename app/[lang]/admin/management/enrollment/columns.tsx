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
import { Button } from "@/components/ui/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import type { Enrollment } from "@/lib/api/admin-enrollment";
import { adminEnrollmentApi } from "@/lib/api/admin-enrollment";
import { useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const ActionCell = ({ enrollment }: { enrollment: Enrollment }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [openDelete, setOpenDelete] = useState(false);

  const handleDelete = async () => {
    try {
      await adminEnrollmentApi.delete(enrollment.id);
      await queryClient.invalidateQueries({
        queryKey: ["admin", "enrollments"],
      });
      toast.success("Enrollment removed successfully");
      router.refresh();
    } catch {
      toast.error("Failed to remove enrollment");
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
            <AlertDialogTitle>Remove enrollment?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the student from this course. This action cannot
              be undone.
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

export const columns: ColumnDef<Enrollment>[] = [
  {
    id: "student",
    accessorFn: (row) =>
      row.student?.fullName ??
      row.student?.email ??
      row.student?.studentId ??
      "",
    meta: { label: "Student" },
    header: "Student",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">
          {row.original.student?.fullName ?? row.original.student?.email ?? "—"}
        </p>
        {row.original.student?.studentId && (
          <p className="text-xs text-muted-foreground">
            {row.original.student.studentId}
          </p>
        )}
      </div>
    ),
  },
  {
    id: "course",
    accessorFn: (row) => row.courseOnSemester?.course?.name ?? "",
    meta: { label: "Course" },
    header: "Course",
    cell: ({ row }) => row.original.courseOnSemester?.course?.name ?? "—",
  },
  {
    id: "semester",
    accessorFn: (row) => row.courseOnSemester?.semester?.name ?? "",
    meta: { label: "Semester" },
    header: "Semester",
    cell: ({ row }) => row.original.courseOnSemester?.semester?.name ?? "—",
  },
  {
    id: "finalGrade",
    accessorFn: (row) => row.finalGrade ?? "",
    meta: { label: "Final grade" },
    header: "Final grade",
    cell: ({ row }) => {
      const g = row.original.finalGrade;
      return g != null ? String(g) : "—";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell enrollment={row.original} />,
  },
];
