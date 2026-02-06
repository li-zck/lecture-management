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
import {
  adminCourseSemesterApi,
  type CourseSemester,
} from "@/lib/api/admin-course-semester";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const ActionCell = ({ courseSemester }: { courseSemester: CourseSemester }) => {
  const router = useRouter();
  const [openDelete, setOpenDelete] = useState(false);

  const handleDelete = async () => {
    try {
      await adminCourseSemesterApi.delete(courseSemester.id);
      toast.success("Schedule deleted successfully");
      router.refresh();
      window.location.reload();
    } catch {
      toast.error("Failed to delete schedule");
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
              router.push(
                `/admin/management/course-semester/${courseSemester.id}`,
              )
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
              schedule.
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

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const columns: ColumnDef<CourseSemester>[] = [
  {
    id: "courseName",
    accessorKey: "course.name",
    meta: { label: "Course" },
    header: "Course",
    cell: ({ row }) => <div>{row.original.course?.name || "N/A"}</div>,
  },
  {
    id: "semesterName",
    accessorKey: "semester.name",
    meta: { label: "Semester" },
    header: "Semester",
    cell: ({ row }) => <div>{row.original.semester?.name || "N/A"}</div>,
  },
  {
    id: "lecturerName",
    accessorKey: "lecturer.fullName",
    meta: { label: "Lecturer" },
    header: "Lecturer",
    cell: ({ row }) => (
      <div>{row.original.lecturer?.fullName || "Unassigned"}</div>
    ),
  },
  {
    accessorKey: "dayOfWeek",
    meta: { label: "Day" },
    header: "Day",
    cell: ({ row }) => {
      const day = row.getValue<number>("dayOfWeek");
      return <div>{day !== null ? DAYS[day] : "N/A"}</div>;
    },
  },
  {
    accessorKey: "location",
    meta: { label: "Location" },
    header: "Location",
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell courseSemester={row.original} />,
  },
];
