"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import { Checkbox } from "@/components/ui/shadcn/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import type {
  DepartmentResponse,
  LecturerAccountResponse,
  ReadAdminAccountResponse,
  StudentAccountResponse,
} from "@/lib/types/dto/api/admin/response/read/read.dto";
import { getDisplayId } from "@/lib/utils";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { Span } from "next/dist/trace";
import { Special_Elite } from "next/font/google";

/**
 * Creates column definitions for entity tables with selection and actions
 * @template T - The entity type
 * @param config - Configuration for the columns
 * @returns Array of column definitions
 */
export const createEntityColumns = <
  T extends { id: string; [key: string]: any },
>(config: {
  fields: Array<{
    key: keyof T;
    header: string;
    sortable?: boolean;
  }>;
  actions?: Array<{ label: string; onClick: (item: T) => void }>;
  router: any;
  deleteHandlerAction?: (item: T) => void;
}): ColumnDef<T>[] => {
  const columns: ColumnDef<T>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    ...config.fields.map((field) => ({
      accessorKey: field.key,
      header: field.header,
      enableSorting: field.sortable ?? true,
    })),
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
              {config.actions?.map((action) => (
                <DropdownMenuItem
                  key={action.label}
                  className={
                    action.label === "Delete"
                      ? "text-red-600 focus:text-red-500"
                      : ""
                  }
                  onClick={(e) => {
                    // prevent events bubbling
                    e.stopPropagation();
                    action.onClick(item);
                  }}
                >
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
};

export const studentColumns = (
  router: any,
  deleteHandlerAction?: (item: StudentAccountResponse) => void,
) =>
  createEntityColumns<StudentAccountResponse>({
    fields: [
      { key: "studentId", header: "Student ID" },
      { key: "fullName", header: "Full Name" },
      { key: "email", header: "Email" },
      { key: "active", header: "Active" },
    ],

    actions: [
      {
        label: "Copy Details",
        onClick: (student) => console.log(`Copying ${student}`),
      },
      {
        label: "Edit",
        onClick: (student) =>
          router.push(`/admin/management/student/${student.id}/edit`),
      },
      ...(deleteHandlerAction
        ? [
            {
              label: "Delete",
              onClick: deleteHandlerAction,
            },
          ]
        : []),
    ],
    router,
    deleteHandlerAction,
  });

export const lecturerColumns = (
  router: any,
  deleteHandlerAction?: (item: LecturerAccountResponse) => void,
) =>
  createEntityColumns<LecturerAccountResponse>({
    fields: [
      { key: "lecturerId", header: "Lecturer ID" },
      { key: "fullName", header: "Full Name" },
      { key: "email", header: "Email" },
      { key: "active", header: "Active" },
    ],

    actions: [
      {
        label: "Copy Details",
        onClick: (lecturer) => console.log(`Copying ${lecturer}`),
      },
      {
        label: "Edit",
        onClick: (lecturer) =>
          router.push(`/admin/management/lecturer/${lecturer.id}/edit`),
      },
      ...(deleteHandlerAction
        ? [
            {
              label: "Delete",
              onClick: deleteHandlerAction,
            },
          ]
        : []),
    ],
    router,
    deleteHandlerAction,
  });

export const departmentColumns = (
  router: any,
  deleteHandlerAction?: (item: DepartmentResponse) => void,
) =>
  createEntityColumns<DepartmentResponse & { headDisplayId?: string | null }>({
    fields: [
      { key: "departmentId", header: "Department ID" },
      { key: "name", header: "Department Name" },
      { key: "headDisplayId", header: "Department Head" },
      { key: "description", header: "Description" },
    ],

    actions: [
      {
        label: "Copy Details",
        onClick: (department) => console.log(`Copying ${department}`),
      },
      {
        label: "Edit",
        onClick: (department) =>
          router.push(`/admin/management/department/${department.id}/edit`),
      },
      ...(deleteHandlerAction
        ? [
            {
              label: "Delete",
              onClick: deleteHandlerAction,
            },
          ]
        : []),
    ],
    router,
    deleteHandlerAction,
  });

export const adminColumns = (
  router: any,
  deleteHandlerAction?: (item: ReadAdminAccountResponse) => void,
) =>
  createEntityColumns<ReadAdminAccountResponse>({
    fields: [
      { key: "username", header: "Username" },
      { key: "active", header: "Active" },
      { key: "createdAt", header: "Created At" },
      { key: "updatedAt", header: "Updated At" },
    ],

    actions: [
      {
        label: "Copy Details",
        onClick: (admin) => console.log(`Copying ${admin}`),
      },
      {
        label: "Edit",
        onClick: (admin) =>
          router.push(`/admin/management/admin/${admin.id}/edit`),
      },
      ...(deleteHandlerAction
        ? [
            {
              label: "Delete",
              onClick: deleteHandlerAction,
            },
          ]
        : []),
    ],
    router,
    deleteHandlerAction,
  });

