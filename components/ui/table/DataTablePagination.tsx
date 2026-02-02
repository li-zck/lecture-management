"use client";

import type { Table } from "@tanstack/react-table";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Trash2,
} from "lucide-react";
import { useState } from "react";

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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/shadcn/select";

type DataTablePaginationProps<TData> = {
	table: Table<TData>;
	bulkDeleteHandlerAction?: (
		selectedItems: TData[],
		onSuccess?: () => void,
	) => void;
	entityName?: string;
};

export function DataTablePagination<TData>({
	table,
	bulkDeleteHandlerAction,
	entityName = "item",
}: DataTablePaginationProps<TData>) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const selectedCount = table.getFilteredSelectedRowModel().rows.length;

	const handleBulkDelete = async () => {
		if (!bulkDeleteHandlerAction) return;

		setIsDeleting(true);
		const selectedItems = table
			.getFilteredSelectedRowModel()
			.rows.map((row) => row.original);

		bulkDeleteHandlerAction(selectedItems, () => {
			table.toggleAllPageRowsSelected(false);
			setShowDeleteDialog(false);
			setIsDeleting(false);
		});
	};

	return (
		<div className="flex items-center justify-between px-2">
			<div className="text-muted-foreground flex-1 text-sm flex items-center gap-2">
				{selectedCount} of {table.getFilteredRowModel().rows.length} row(s)
				selected.
				{selectedCount > 0 && bulkDeleteHandlerAction && (
					<Button
						variant="destructive"
						size="sm"
						onClick={() => setShowDeleteDialog(true)}
						className="ml-4 gap-2"
					>
						<Trash2 className="h-4 w-4" />
						Delete {selectedCount}{" "}
						{selectedCount === 1 ? entityName : `${entityName}s`}
					</Button>
				)}
			</div>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete{" "}
							<strong>{selectedCount}</strong>{" "}
							{selectedCount === 1 ? entityName : `${entityName}s`} and remove
							all associated data.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							disabled={isDeleting}
							onClick={(e) => {
								e.preventDefault();
								handleBulkDelete();
							}}
							className="bg-red-600 hover:bg-red-700"
						>
							{isDeleting
								? "Deleting..."
								: `Delete ${selectedCount} ${selectedCount === 1 ? entityName : `${entityName}s`}`}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<div className="flex items-center space-x-6 lg:space-x-8">
				<div className="flex items-center space-x-2">
					<p className="text-sm font-medium">Rows per page</p>
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value) => {
							table.setPageSize(Number(value));
						}}
					>
						<SelectTrigger className="h-8 w-[70px]">
							<SelectValue placeholder={table.getState().pagination.pageSize} />
						</SelectTrigger>
						<SelectContent side="top">
							{[10, 20, 25, 30, 40, 50].map((pageSize) => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex w-[100px] items-center justify-center text-sm font-medium">
					Page {table.getState().pagination.pageIndex + 1} of{" "}
					{table.getPageCount()}
				</div>
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						size="icon"
						className="hidden size-8 lg:flex"
						onClick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
					>
						<span className="sr-only">Go to first page</span>
						<ChevronsLeft />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="size-8"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						<span className="sr-only">Go to previous page</span>
						<ChevronLeft />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="size-8"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">Go to next page</span>
						<ChevronRight />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="hidden size-8 lg:flex"
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">Go to last page</span>
						<ChevronsRight />
					</Button>
				</div>
			</div>
		</div>
	);
}
