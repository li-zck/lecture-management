"use client";

import {
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn";
import { Checkbox } from "@/components/ui/shadcn/checkbox";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableViewOptions } from "./DataTableViewOptions";

/**
 * Props for the DataTable component
 * @template TData - The type of data objects in the table
 * @template TValue - The type of values in the table cells
 */
type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterColumn?: string;
  filterPlaceholder?: string;
  entityType?:
    | "student"
    | "lecturer"
    | "department"
    | "admin"
    | "course"
    | "semester"
    | "course-semester"
    | "enrollment-session"
    | "enrollment"
    | "post";
  bulkDeleteHandlerAction?: (
    selectedItems: TData[],
    onSuccess?: () => void,
  ) => void;
  entityName?: string;
  /** Initial column visibility (e.g. { recommendedSemester: false }) */
  initialColumnVisibility?: VisibilityState;
};

export function DataTable<TData extends { id: string }, TValue>({
  columns,
  data,
  filterColumn,
  filterPlaceholder = "Filter by name...",
  entityType,
  bulkDeleteHandlerAction,
  entityName,
  initialColumnVisibility,
}: DataTableProps<TData, TValue>) {
  // Derive entity name from entityType if not provided
  const resolvedEntityName = entityName || entityType || "item";
  const getDefaultFilterColumn = () => {
    if (entityType === "department") return "name";
    if (entityType === "course-semester") return "courseName";
    return "fullName";
  };
  const actualFilterColumn = filterColumn || getDefaultFilterColumn();

  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialColumnVisibility ?? {},
  );
  const [rowSelection, setRowSelection] = useState({});

  // Add select column at the beginning
  const allColumns = useMemo(() => {
    const selectColumn: ColumnDef<TData, TValue> = {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    };
    return [selectColumn, ...columns];
  }, [columns]);

  const getDetailUrl = (entityType: string, id: string) => {
    return `/admin/management/${entityType}/${id}`;
  };

  const handleRowClick = (row: any) => {
    if (entityType) {
      router.push(getDetailUrl(entityType, row.original.id));
    }
  };

  const table = useReactTable({
    data,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div>
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-sm">
          <Input
            placeholder={filterPlaceholder}
            value={
              (table
                .getColumn(actualFilterColumn)
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn(actualFilterColumn)
                ?.setFilterValue(event.target.value)
            }
            className="w-full"
          />
        </div>

        <DataTableViewOptions table={table} />
      </div>

      <div className="mb-5 overflow-x-auto rounded-md border">
        <Table className="min-w-[640px]">
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
                    entityType
                      ? "cursor-pointer hover:bg-gray-800 transition-colors"
                      : ""
                  }
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => handleRowClick(row)}
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
                  colSpan={allColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        table={table}
        bulkDeleteHandlerAction={bulkDeleteHandlerAction}
        entityName={resolvedEntityName}
      />
    </div>
  );
}
