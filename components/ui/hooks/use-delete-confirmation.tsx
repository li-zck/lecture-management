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
import { getClientDictionary, useLocale } from "@/lib/i18n";
import { type EntityWithIds, getEntityId } from "@/lib/utils/idMapping";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteDialogState {
  isOpen: boolean;
  item?: EntityWithIds;
  items?: EntityWithIds[];
  type: "single" | "bulk";
  entityName: string;
  deleteFn?: (id: string) => void;
  bulkDeleteFn?: (ids: string[]) => void;
  onSuccess?: () => void;
}

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
}: DeleteConfirmationDialogProps) {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            {cancelText ?? dict.common.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {confirmText ?? dict.admin.common.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const createDeleteHandler = <T extends EntityWithIds>(
  setDeleteDialogState: (state: DeleteDialogState) => void,
  deleteFn: (id: string) => void,
  entityName: string,
  onSuccess?: () => void,
) => {
  return (item: T) => {
    setDeleteDialogState({
      isOpen: true,
      item,
      type: "single",
      entityName,
      deleteFn,
      onSuccess,
    });
  };
};

const createBulkDeleteHandler = (
  setDeleteDialogState: (state: DeleteDialogState) => void,
  deleteFn: (ids: string[]) => void,
  entityName: string,
  onSuccess?: () => void,
) => {
  return (selectedItems: EntityWithIds[]) => {
    setDeleteDialogState({
      isOpen: true,
      items: selectedItems,
      type: "bulk",
      entityName,
      bulkDeleteFn: deleteFn,
      onSuccess,
    });
  };
};

/*
 * Hook to manage delete operations with confirmation
 * */
export function useDeleteConfirmation() {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const [deleteDialogState, setDeleteDialogState] = useState<DeleteDialogState>(
    {
      isOpen: false,
      type: "single",
      entityName: "",
    },
  );

  const handleDeleteConfirm = async () => {
    const { item, items, type, entityName, deleteFn, bulkDeleteFn, onSuccess } =
      deleteDialogState;

    try {
      if (type === "single" && item && deleteFn) {
        const internalId = getEntityId(item);

        deleteFn(internalId);

        toast.success(
          dict.admin.common.deletedSuccess.replace("{entity}", entityName),
        );
      } else if (type === "bulk" && items && bulkDeleteFn) {
        const internalIds = items.map((item) => getEntityId(item));

        bulkDeleteFn(internalIds);

        toast.success(
          dict.admin.common.bulkDeleteSuccess
            .replace("{count}", String(items.length))
            .replace("{entity}", entityName),
        );
      }

      setDeleteDialogState({ isOpen: false, type: "single", entityName: "" });

      // call onSuccess callback after successful deletion (for clearing selections)
      // only calls on methods with 'onSuccess()'
      if (onSuccess) {
        onSuccess();
      } else {
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error: any) {
      toast.error(
        error.message ||
          dict.admin.common.deleteFailed.replace("{entity}", entityName),
      );
    }
  };

  const createDeleteHandlerWithState = <_T extends EntityWithIds>(
    deleteFn: (id: string) => void,
    entityName: string,
    onSuccess?: () => void,
  ) => {
    return createDeleteHandler(
      setDeleteDialogState,
      deleteFn,
      entityName,
      onSuccess,
    );
  };

  const createBulkDeleteHandlerWithState = (
    deleteFn: (ids: string[]) => void,
    entityName: string,
  ) => {
    return (selectedItems: EntityWithIds[], onSuccess?: () => void) => {
      const handler = createBulkDeleteHandler(
        setDeleteDialogState,
        deleteFn,
        entityName,
        onSuccess,
      );
      return handler(selectedItems);
    };
  };

  const deleteDialog = (
    <DeleteConfirmationDialog
      isOpen={deleteDialogState.isOpen}
      onClose={() =>
        setDeleteDialogState({ isOpen: false, type: "single", entityName: "" })
      }
      onConfirm={handleDeleteConfirm}
      title={dict.admin.common.confirmTitle}
      description={
        deleteDialogState.type === "single"
          ? dict.admin.common.confirmDeleteBody.replace(
              "{entity}",
              deleteDialogState.entityName,
            )
          : dict.admin.table.deleteSelectedConfirm
              .replace("{count}", String(deleteDialogState.items?.length || 0))
              .replace("{entity}", deleteDialogState.entityName)
      }
    />
  );

  return {
    createDeleteHandler: createDeleteHandlerWithState,
    createBulkDeleteHandler: createBulkDeleteHandlerWithState,
    deleteDialog,
  };
}
