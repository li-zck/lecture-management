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
import { Badge } from "@/components/ui/shadcn/badge";
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
  adminEnrollmentSessionApi,
  type EnrollmentSession,
} from "@/lib/api/admin-enrollment-session";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const ActionCell = ({ session }: { session: EnrollmentSession }) => {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const router = useRouter();
  const [openDelete, setOpenDelete] = useState(false);

  const handleDelete = async () => {
    try {
      await adminEnrollmentSessionApi.delete(session.id);
      toast.success(
        dict.admin.common.deletedSuccess.replace(
          "{entity}",
          "Enrollment session",
        ),
      );
      router.refresh();
      window.location.reload();
    } catch {
      toast.error(
        dict.admin.common.deleteFailed.replace(
          "{entity}",
          "enrollment session",
        ),
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
              router.push(`/admin/management/enrollment-session/${session.id}`)
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
                "enrollment session",
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

function getSessionStatus(
  session: EnrollmentSession,
  dict: any,
): {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
} {
  const now = new Date();
  const start = new Date(session.startDate);
  const end = new Date(session.endDate);

  if (!session.isActive) {
    return {
      label: dict.admin.enrollmentSessions.inactive,
      variant: "secondary",
    };
  }

  if (now < start) {
    return {
      label: dict.admin.enrollmentSessions.scheduled,
      variant: "outline",
    };
  }

  if (now >= start && now <= end) {
    return { label: dict.admin.enrollmentSessions.open, variant: "default" };
  }

  return {
    label: dict.admin.enrollmentSessions.closed,
    variant: "destructive",
  };
}

export function getColumns(dict: any): ColumnDef<EnrollmentSession>[] {
  return [
    {
      accessorKey: "name",
      meta: { label: dict.admin.enrollmentSessions.sessionName },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={dict.admin.enrollmentSessions.sessionName}
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.getValue("name") || dict.admin.enrollmentSessions.unnamedSession}
        </div>
      ),
    },
    {
      accessorKey: "semester.name",
      meta: { label: dict.admin.enrollmentSessions.semester },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={dict.admin.enrollmentSessions.semester}
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original.semester?.name || dict.admin.enrollmentSessions.unknown}
        </div>
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
        <div>{format(new Date(row.getValue("startDate")), "PPP p")}</div>
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
        <div>{format(new Date(row.getValue("endDate")), "PPP p")}</div>
      ),
    },
    {
      accessorKey: "isActive",
      meta: { label: dict.admin.common.status },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={dict.admin.common.status}
        />
      ),
      cell: ({ row }) => {
        const status = getSessionStatus(row.original, dict);
        return <Badge variant={status.variant}>{status.label}</Badge>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionCell session={row.original} />,
    },
  ];
}
