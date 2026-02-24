"use client";

import { useFormPersistence } from "@/components/ui/hooks/use-form-persistence";
import { useLecturers } from "@/components/ui/hooks/use-lecturer";
import { Field, FieldError, FieldLabel } from "@/components/ui/shadcn";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { Input } from "@/components/ui/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";
import { createDepartmentSchema } from "@/lib/zod/schemas/create/department";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

type DepartmentFormValues = z.infer<typeof createDepartmentSchema>;

interface DepartmentFormProps {
  initialValues?: Partial<DepartmentFormValues>;
  onSubmit: (values: DepartmentFormValues) => Promise<void>;
  onDelete?: () => Promise<void>;
  mode: "create" | "edit";
}

export function DepartmentForm({
  initialValues,
  onSubmit,
  onDelete,
  mode,
}: DepartmentFormProps) {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const { lecturers } = useLecturers();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues: {
      departmentId: initialValues?.departmentId ?? "",
      name: initialValues?.name ?? "",
      description: initialValues?.description ?? "",
      headId: initialValues?.headId ?? "none",
    },
  });

  // Persist form data across page reloads (only in create mode)
  const { clearPersistedData } = useFormPersistence({
    key: "department-form-create",
    form,
    enabled: mode === "create",
  });

  const handleSubmit = async (values: DepartmentFormValues) => {
    await onSubmit(values);
    if (typeof clearPersistedData === "function") {
      clearPersistedData();
    }
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>
            {mode === "create"
              ? dict.admin.departments.createDepartment
              : dict.admin.departments.editDepartment}
          </CardTitle>
          <CardDescription>
            {mode === "create"
              ? dict.admin.common.fillDetails.replace("{entity}", "department")
              : dict.admin.common.updateDetails.replace(
                  "{entity}",
                  "department",
                )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="department-form-name">
                      {dict.admin.departments.departmentName}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="department-form-name"
                      aria-invalid={fieldState.invalid}
                      placeholder={
                        dict.admin.departments.departmentNamePlaceholder
                      }
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="departmentId"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="department-form-id">
                      {dict.admin.departments.departmentId}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="department-form-id"
                      aria-invalid={fieldState.invalid}
                      placeholder={
                        dict.admin.departments.departmentIdPlaceholder
                      }
                      disabled={mode === "edit"}
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              control={form.control}
              name="headId"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="department-form-headId">
                    {dict.admin.departments.headOfDepartment}
                  </FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger id="department-form-headId">
                      <SelectValue
                        placeholder={dict.admin.departments.selectLecturer}
                      />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={5}>
                      <SelectItem value="none">-</SelectItem>
                      {lecturers.map((lecturer) => (
                        <SelectItem key={lecturer.id} value={lecturer.id}>
                          {lecturer.fullName} ({lecturer.lecturerId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="department-form-description">
                    {dict.admin.common.description}
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="department-form-description"
                    aria-invalid={fieldState.invalid}
                    placeholder={dict.admin.departments.descriptionPlaceholder}
                    className="resize-none min-h-[120px]"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {mode === "edit" && onDelete ? (
            <Button
              type="button"
              variant="destructive"
              disabled={form.formState.isSubmitting || isDeleting}
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash className="mr-2 h-4 w-4" />
              {dict.admin.common.delete}
            </Button>
          ) : (
            <div />
          )}
          <Button
            type="button"
            disabled={form.formState.isSubmitting || isDeleting}
            onClick={form.handleSubmit(handleSubmit as any)}
          >
            {mode === "create"
              ? dict.admin.departments.createDepartment
              : dict.admin.common.saveChanges}
          </Button>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dict.admin.common.confirmTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dict.admin.departments.confirmDeleteBody.replace(
                "{name}",
                initialValues?.name ?? "",
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {dict.admin.common.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={async (e) => {
                e.preventDefault();
                if (onDelete) {
                  setIsDeleting(true);
                  try {
                    await onDelete();
                  } finally {
                    setIsDeleting(false);
                    setShowDeleteDialog(false);
                  }
                }
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
    </div>
  );
}
