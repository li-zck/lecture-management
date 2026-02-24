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
import {
  adminDepartmentApi,
  type Department,
} from "@/lib/api/admin-department";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale, useLocalePath } from "@/lib/i18n/use-locale";

const ActionCell = ({ department }: { department: Department }) => {
  const locale = useLocale();
  const localePath = useLocalePath();
  const dict = getClientDictionary(locale);
  const router = useRouter();
  const [openDelete, setOpenDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await adminDepartmentApi.delete(department.id);
      toast.success(
        dict.admin.common.deletedSuccess.replace("{entity}", "Department"),
      );
      router.refresh();
      window.location.reload();
    } catch (error: unknown) {
      const err = error as { message?: string; status?: number };
      toast.error(
        err?.message ||
          dict.admin.common.deleteFailed.replace("{entity}", "department"),
      );
    } finally {
      setIsDeleting(false);
      setOpenDelete(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="sr-only">{dict.admin.common.openMenu}</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{dict.admin.common.actions}</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              router.push(
                localePath(`admin/management/department/${department.id}`),
              );
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            {dict.admin.common.edit}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setOpenDelete(true);
            }}
            className="text-red-600 focus:text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" />
            {dict.admin.common.delete}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dict.admin.common.confirmTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dict.admin.departments.confirmDeleteBody.replace(
                "{name}",
                department.name,
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {dict.admin.common.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting
                ? dict.admin.common.deleting
                : dict.admin.common.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export function getColumns(dict: any): ColumnDef<Department>[] {
  return [
    {
      accessorKey: "departmentId",
      meta: { label: dict.admin.departments.departmentId },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={dict.admin.departments.departmentId}
        />
      ),
      cell: ({ row }) => (
        <div className="w-[100px]">{row.getValue("departmentId")}</div>
      ),
    },
    {
      accessorKey: "name",
      meta: { label: dict.admin.departments.departmentName },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={dict.admin.departments.departmentName}
        />
      ),
    },
    {
      accessorKey: "head.fullName",
      meta: { label: dict.admin.departments.headOfDepartment },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={dict.admin.departments.headOfDepartment}
        />
      ),
      cell: ({ row }) => (
        <div>{row.original.head?.fullName || dict.admin.common.na}</div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionCell department={row.original} />,
    },
  ];
}
