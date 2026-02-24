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
import { DataTableColumnHeader } from "@/components/ui/table/DataTableColumnHeader";
import { adminCourseApi, type Course } from "@/lib/api/admin-course";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale, useLocalePath } from "@/lib/i18n/use-locale";
import { queryKeys } from "@/lib/query";
import { useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const ActionCell = ({ course }: { course: Course }) => {
  const locale = useLocale();
  const localePath = useLocalePath();
  const dict = getClientDictionary(locale);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [openDelete, setOpenDelete] = useState(false);

  const handleDelete = async () => {
    try {
      await adminCourseApi.delete(course.id);
      await queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
      toast.success(
        dict.admin.common.deletedSuccess.replace("{entity}", "Course"),
      );
      router.refresh();
    } catch {
      toast.error(dict.admin.common.deleteFailed.replace("{entity}", "course"));
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
              router.push(localePath(`admin/management/course/${course.id}`))
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
                "course",
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

export function getColumns(dict: any): ColumnDef<Course>[] {
  return [
    {
      accessorKey: "name",
      meta: { label: dict.admin.courses.courseName },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={dict.admin.courses.courseName}
        />
      ),
    },
    {
      accessorKey: "credits",
      meta: { label: dict.admin.courses.credits },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={dict.admin.courses.credits}
        />
      ),
    },
    {
      id: "offeredIn",
      accessorFn: (row) =>
        row.courseOnSemesters?.map((c) => c.semester.name).join(", ") ?? "",
      meta: { label: dict.admin.courses.offeredIn },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={dict.admin.courses.offeredIn}
        />
      ),
      cell: ({ row }) => {
        const names = row.original.courseOnSemesters?.map(
          (c) => c.semester.name,
        );
        return <span>{names?.length ? names.join(", ") : "—"}</span>;
      },
    },
    {
      accessorKey: "recommendedSemester",
      meta: { label: dict.admin.courses.recommendedLevel },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={dict.admin.courses.recommendedLevel}
        />
      ),
      cell: ({ row }) => (
        <span>{row.original.recommendedSemester?.trim() || "—"}</span>
      ),
    },
    {
      accessorKey: "department.name",
      meta: { label: dict.admin.common.department },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={dict.admin.common.department}
        />
      ),
      cell: ({ row }) => (
        <div>{row.original.department?.name || dict.admin.common.na}</div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionCell course={row.original} />,
    },
  ];
}
