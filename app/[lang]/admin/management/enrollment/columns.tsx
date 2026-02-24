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
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";
import { useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const ActionCell = ({ enrollment }: { enrollment: Enrollment }) => {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [openDelete, setOpenDelete] = useState(false);

  const handleDelete = async () => {
    try {
      await adminEnrollmentApi.delete(enrollment.id);
      await queryClient.invalidateQueries({
        queryKey: ["admin", "enrollments"],
      });
      toast.success(dict.admin.enrollments.removedSuccess);
      router.refresh();
    } catch {
      toast.error(dict.admin.enrollments.removeFailed);
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
              {dict.admin.enrollments.removeTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dict.admin.enrollments.removeBody}
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

export function getColumns(dict: any): ColumnDef<Enrollment>[] {
  return [
    {
      id: "student",
      accessorFn: (row) =>
        row.student?.fullName ??
        row.student?.email ??
        row.student?.studentId ??
        "",
      meta: { label: dict.admin.enrollments.student },
      header: dict.admin.enrollments.student,
      cell: ({ row }) => (
        <div>
          <p className="font-medium">
            {row.original.student?.fullName ??
              row.original.student?.email ??
              "—"}
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
      meta: { label: dict.admin.enrollments.course },
      header: dict.admin.enrollments.course,
      cell: ({ row }) => row.original.courseOnSemester?.course?.name ?? "—",
    },
    {
      id: "semester",
      accessorFn: (row) => row.courseOnSemester?.semester?.name ?? "",
      meta: { label: dict.admin.enrollments.semester },
      header: dict.admin.enrollments.semester,
      cell: ({ row }) => row.original.courseOnSemester?.semester?.name ?? "—",
    },
    {
      id: "finalGrade",
      accessorFn: (row) => row.finalGrade ?? "",
      meta: { label: dict.admin.enrollments.finalGrade },
      header: dict.admin.enrollments.finalGrade,
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
}
