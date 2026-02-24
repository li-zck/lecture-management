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
import { adminLecturerApi, type LecturerAdmin } from "@/lib/api/admin-lecturer";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale, useLocalePath } from "@/lib/i18n/use-locale";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const ActionCell = ({ lecturer }: { lecturer: LecturerAdmin }) => {
  const locale = useLocale();
  const localePath = useLocalePath();
  const dict = getClientDictionary(locale);
  const router = useRouter();
  const [openDelete, setOpenDelete] = useState(false);

  const handleDelete = async () => {
    try {
      await adminLecturerApi.delete(lecturer.id);
      toast.success(
        dict.admin.common.deletedSuccess.replace("{entity}", "Lecturer"),
      );
      router.refresh();
      window.location.reload();
    } catch {
      toast.error(
        dict.admin.common.deleteFailed.replace("{entity}", "lecturer"),
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
                localePath(`admin/management/lecturer/${lecturer.id}`),
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
                "lecturer account",
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

export function getColumns(dict: any): ColumnDef<LecturerAdmin>[] {
  return [
    {
      accessorKey: "lecturerId",
      meta: { label: dict.admin.lecturers.lecturerId },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={dict.admin.lecturers.lecturerId}
        />
      ),
      cell: ({ row }) => (
        <div className="w-[100px]">{row.getValue("lecturerId")}</div>
      ),
    },
    {
      accessorKey: "fullName",
      meta: { label: dict.admin.common.fullName },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={dict.admin.common.fullName}
        />
      ),
    },
    {
      accessorKey: "username",
      meta: { label: dict.admin.common.username },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={dict.admin.common.username}
        />
      ),
    },
    {
      accessorKey: "email",
      meta: { label: dict.admin.common.email },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={dict.admin.common.email}
        />
      ),
    },
    {
      accessorKey: "active",
      meta: { label: dict.admin.common.status },
      header: dict.admin.common.status,
      cell: ({ row }) => (
        <div
          className={row.original.active ? "text-green-600" : "text-red-600"}
        >
          {row.original.active
            ? dict.admin.common.active
            : dict.admin.common.inactive}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionCell lecturer={row.original} />,
    },
  ];
}
