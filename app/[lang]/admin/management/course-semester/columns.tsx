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
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const ActionCell = ({ courseSemester }: { courseSemester: CourseSemester }) => {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const router = useRouter();
  const [openDelete, setOpenDelete] = useState(false);

  const handleDelete = async () => {
    try {
      await adminCourseSemesterApi.delete(courseSemester.id);
      toast.success(
        dict.admin.common.deletedSuccess.replace("{entity}", "Schedule"),
      );
      router.refresh();
      window.location.reload();
    } catch {
      toast.error(
        dict.admin.common.deleteFailed.replace("{entity}", "schedule"),
      );
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">{dict.admin.common.openMenu}</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{dict.admin.common.actions}</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              router.push(
                `/admin/management/course-semester/${courseSemester.id}`,
              )
            }
          >
            <Pencil className="mr-2 h-4 w-4" />
            {dict.admin.common.edit}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenDelete(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" />
            {dict.admin.common.delete}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dict.admin.common.confirmTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dict.admin.common.confirmDeleteBody.replace(
                "{entity}",
                "schedule",
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{dict.admin.common.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              {dict.admin.common.delete}
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

export function getColumns(dict: any): ColumnDef<CourseSemester>[] {
  return [
    {
      id: "courseName",
      accessorKey: "course.name",
      meta: { label: dict.admin.courseSemesters.course },
      header: dict.admin.courseSemesters.course,
      cell: ({ row }) => (
        <div>{row.original.course?.name || dict.admin.common.na}</div>
      ),
    },
    {
      id: "semesterName",
      accessorKey: "semester.name",
      meta: { label: dict.admin.courseSemesters.semester },
      header: dict.admin.courseSemesters.semester,
      cell: ({ row }) => (
        <div>{row.original.semester?.name || dict.admin.common.na}</div>
      ),
    },
    {
      id: "lecturerName",
      accessorKey: "lecturer.fullName",
      meta: { label: dict.admin.courseSemesters.lecturer },
      header: dict.admin.courseSemesters.lecturer,
      cell: ({ row }) => (
        <div>
          {row.original.lecturer?.fullName || dict.admin.common.unassigned}
        </div>
      ),
    },
    {
      accessorKey: "dayOfWeek",
      meta: { label: dict.admin.courseSemesters.day },
      header: dict.admin.courseSemesters.day,
      cell: ({ row }) => {
        const day = row.getValue<number>("dayOfWeek");
        return <div>{day !== null ? DAYS[day] : dict.admin.common.na}</div>;
      },
    },
    {
      accessorKey: "location",
      meta: { label: dict.admin.courseSemesters.location },
      header: dict.admin.courseSemesters.location,
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionCell courseSemester={row.original} />,
    },
  ];
}
