"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn";
import { Badge } from "@/components/ui/shadcn/badge";
import { DataTableColumnHeader } from "@/components/ui/table/DataTableColumnHeader";
import { DataTablePagination } from "@/components/ui/table/DataTablePagination";
import type { CourseSemester } from "@/lib/api/course-semester";
import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

function formatTime(minutes: number | null, tba = "TBA"): string {
  if (minutes === null) return tba;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

type CoursesTableProps = {
  data: CourseSemester[];
  daysOfWeek: string[];
  labels: {
    course: string;
    semester: string;
    department: string;
    credits: string;
    schedule: string;
    location: string;
    lecturer: string;
    enrollment: string;
    enrolled: string;
    teaching: string;
    full: string;
    tba: string;
    unknownCourse: string;
  };
  enrolledIds: Set<string>;
  myAssignedIds: Set<string>;
  isStudent: boolean;
  isLecturer: boolean;
  onRowClick: (offering: CourseSemester) => void;
};

export function CoursesTable({
  data,
  daysOfWeek,
  labels,
  enrolledIds,
  myAssignedIds,
  isStudent,
  isLecturer,
  onRowClick,
}: CoursesTableProps) {
  const columns = useMemo<ColumnDef<CourseSemester>[]>(
    () => [
      {
        accessorKey: "course.name",
        meta: { label: labels.course },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={labels.course} />
        ),
        cell: ({ row }) => {
          const offering = row.original;
          const enrollmentCount = offering._count?.enrollments ?? 0;
          const capacity = offering.capacity;
          const isFull = capacity !== null && enrollmentCount >= capacity;

          return (
            <div className="flex flex-col gap-1">
              <span className="font-medium">
                {offering.course?.name ?? labels.unknownCourse}
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {isStudent && enrolledIds.has(offering.id) && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/15 text-primary text-xs"
                  >
                    {labels.enrolled}
                  </Badge>
                )}
                {isLecturer && myAssignedIds.has(offering.id) && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/15 text-primary text-xs"
                  >
                    {labels.teaching}
                  </Badge>
                )}
                {isFull && (
                  <Badge variant="destructive" className="text-xs">
                    {labels.full}
                  </Badge>
                )}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "semester.name",
        meta: { label: labels.semester },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={labels.semester} />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.semester?.name ?? labels.tba}
          </span>
        ),
      },
      {
        accessorKey: "course.department.name",
        meta: { label: labels.department },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={labels.department} />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.course?.department?.name ?? labels.tba}
          </span>
        ),
      },
      {
        accessorKey: "course.credits",
        meta: { label: labels.credits },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={labels.credits} />
        ),
        cell: ({ row }) => (
          <Badge variant="outline">
            {row.original.course?.credits ?? 0} {labels.credits}
          </Badge>
        ),
      },
      {
        id: "schedule",
        meta: { label: labels.schedule },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={labels.schedule} />
        ),
        cell: ({ row }) => {
          const o = row.original;
          if (o.dayOfWeek === null) return labels.tba;
          return (
            <span className="text-muted-foreground text-sm">
              {daysOfWeek[o.dayOfWeek]}, {formatTime(o.startTime, labels.tba)} -{" "}
              {formatTime(o.endTime, labels.tba)}
            </span>
          );
        },
      },
      {
        accessorKey: "location",
        meta: { label: labels.location },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={labels.location} />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm max-w-[120px] truncate block">
            {row.original.location ?? labels.tba}
          </span>
        ),
      },
      {
        accessorKey: "lecturer.fullName",
        meta: { label: labels.lecturer },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={labels.lecturer} />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {row.original.lecturer?.fullName ??
              row.original.lecturer?.lecturerId ??
              labels.tba}
          </span>
        ),
      },
      {
        id: "enrollment",
        meta: { label: labels.enrollment },
        header: labels.enrollment,
        cell: ({ row }) => {
          const o = row.original;
          const count = o._count?.enrollments ?? 0;
          const cap = o.capacity;
          return (
            <span className="text-sm">
              {count}
              {cap !== null && `/${cap}`}
            </span>
          );
        },
      },
    ],
    [labels, daysOfWeek, enrolledIds, myAssignedIds, isStudent, isLecturer],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  const canInteract = isStudent || isLecturer;

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={
                    canInteract
                      ? "cursor-pointer hover:bg-muted/50 transition-colors"
                      : ""
                  }
                  onClick={() => canInteract && onRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No courses to display.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} showSelection={false} />
    </div>
  );
}
