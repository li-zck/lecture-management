"use client";

import { Input } from "@/components/ui/shadcn/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/shadcn/table";
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { DataTableColumnHeader } from "./DataTableColumnHeader";

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
};

export function DataTable<TData, TValue>({
	columns,
	data,
	filterColumn = "fullName",
	filterPlaceholder = "Filter...",
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});

	const table = useReactTable({
		data,
		columns,
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
			<div className="flex justify-between mb-3">
				<div>
					<Input
						placeholder={filterPlaceholder}
						value={
							(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""
						}
						onChange={(event) =>
							table.getColumn(filterColumn)?.setFilterValue(event.target.value)
						}
						className="max-w-sm"
					/>
				</div>

				<DataTableViewOptions table={table} />
			</div>

			<Table className="overflow-hidden rounded-md border mb-5">
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								const headerContent = header.column.columnDef.header;
								const title =
									typeof headerContent === "function"
										? headerContent(header.getContext())
										: headerContent;

								return (
									<TableHead key={header.id}>
										{header.isPlaceholder ? null : (
											<DataTableColumnHeader
												column={header.column}
												title={title}
											/>
										)}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>

				<TableBody>
					{table.getRowModel().rows.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			<DataTablePagination table={table} />
		</div>
	);
}
