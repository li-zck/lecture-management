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
import { format } from "date-fns";
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
import { adminSemesterApi, type Semester } from "@/lib/api/admin-semester";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";

const ActionCell = ({ semester }: { semester: Semester }) => {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [openDelete, setOpenDelete] = useState(false);

  const handleDelete = async () => {
    try {
      await adminSemesterApi.delete(semester.id);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.semesters.all,
      });
      toast.success(
        dict.admin.common.deletedSuccess.replace("{entity}", "Semester"),
      );
      router.refresh();
    } catch {
      toast.error(
        dict.admin.common.deleteFailed.replace("{entity}", "semester"),
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
              router.push(`/admin/management/semester/${semester.id}`)
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
                "semester",
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

export function getColumns(dict: any): ColumnDef<Semester>[] {
  return [
    {
      accessorKey: "name",
      meta: { label: dict.admin.semesters.semesterName },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={dict.admin.semesters.semesterName}
        />
      ),
    },
    {
      accessorKey: "startDate",
      meta: { label: dict.admin.common.startDate },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={dict.admin.common.startDate}
        />
      ),
      cell: ({ row }) => (
        <div>{format(new Date(row.getValue("startDate")), "PPP")}</div>
      ),
    },
    {
      accessorKey: "endDate",
      meta: { label: dict.admin.common.endDate },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={dict.admin.common.endDate}
        />
      ),
      cell: ({ row }) => (
        <div>{format(new Date(row.getValue("endDate")), "PPP")}</div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionCell semester={row.original} />,
    },
  ];
}
