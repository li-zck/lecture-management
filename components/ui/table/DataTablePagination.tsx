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
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";

type DataTablePaginationProps<TData> = {
  table: Table<TData>;
  bulkDeleteHandlerAction?: (
    selectedItems: TData[],
    onSuccess?: () => void,
  ) => void;
  entityName?: string;
  /** When false, hides the selection count and bulk delete UI (e.g. for public/browse tables) */
  showSelection?: boolean;
};

export function DataTablePagination<TData>({
  table,
  bulkDeleteHandlerAction,
  entityName = "item",
  showSelection = true,
}: DataTablePaginationProps<TData>) {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const t = dict.admin.table;
  const c = dict.admin.common;
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
    <div className="flex flex-col gap-4 px-2 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-2">
      {showSelection && (
        <>
          <div className="flex flex-1 flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {t.rowsSelected
              .replace("{selected}", String(selectedCount))
              .replace(
                "{total}",
                String(table.getFilteredRowModel().rows.length),
              )}
            {selectedCount > 0 && bulkDeleteHandlerAction && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="ml-4 gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {t.deleteSelected
                  .replace("{count}", String(selectedCount))
                  .replace(
                    "{entity}",
                    selectedCount === 1 ? entityName : `${entityName}s`,
                  )}
              </Button>
            )}
          </div>

          {/* Delete Confirmation Dialog */}
          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{c.confirmTitle}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t.deleteSelectedConfirm
                    .replace("{count}", String(selectedCount))
                    .replace(
                      "{entity}",
                      selectedCount === 1 ? entityName : `${entityName}s`,
                    )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  {c.cancel}
                </AlertDialogCancel>
                <AlertDialogAction
                  disabled={isDeleting}
                  onClick={(e) => {
                    e.preventDefault();
                    handleBulkDelete();
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting
                    ? c.deleting
                    : t.deleteSelected
                        .replace("{count}", String(selectedCount))
                        .replace(
                          "{entity}",
                          selectedCount === 1 ? entityName : `${entityName}s`,
                        )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
      <div
        className={`flex flex-wrap items-center justify-center gap-4 sm:justify-end sm:gap-6 lg:gap-8 ${!showSelection ? "ml-auto" : ""}`}
      >
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">{c.rowsPerPage}</p>
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
          {t.pageOf
            .replace(
              "{current}",
              String(table.getState().pagination.pageIndex + 1),
            )
            .replace("{total}", String(table.getPageCount()))}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t.goToFirstPage}</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t.goToPreviousPage}</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t.goToNextPage}</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t.goToLastPage}</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
