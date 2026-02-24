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
import { adminPostApi, type Post } from "@/lib/api/admin-post";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";

const ActionCell = ({ post }: { post: Post }) => {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const router = useRouter();
  const [openDelete, setOpenDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await adminPostApi.delete(post.id);
      toast.success(
        dict.admin.common.deletedSuccess.replace("{entity}", "Post"),
      );
      router.refresh();
      window.location.reload();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(
        err?.message ||
          dict.admin.common.deleteFailed.replace("{entity}", "post"),
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
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{dict.admin.common.actions}</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/management/post/${post.id}`);
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
              {dict.admin.common.confirmDeleteBody.replace(
                "{entity}",
                `post "${post.title}"`,
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

export function getColumns(dict: any): ColumnDef<Post>[] {
  return [
    {
      accessorKey: "title",
      meta: { label: dict.admin.posts.postTitle },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={dict.admin.posts.postTitle}
        />
      ),
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "type",
      meta: { label: dict.admin.posts.type },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dict.admin.posts.type} />
      ),
    },
    {
      accessorKey: "isPublic",
      meta: { label: dict.admin.posts.public },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={dict.admin.posts.public}
        />
      ),
      cell: ({ row }) => (
        <span
          className={
            row.getValue("isPublic")
              ? "text-green-600"
              : "text-muted-foreground"
          }
        >
          {row.getValue("isPublic")
            ? dict.admin.common.yes
            : dict.admin.common.no}
        </span>
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
        <div>{row.original.department?.name ?? dict.admin.common.global}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      meta: { label: dict.admin.posts.created },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={dict.admin.posts.created}
        />
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground text-sm">
          {new Date(row.getValue("createdAt")).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionCell post={row.original} />,
    },
  ];
}
