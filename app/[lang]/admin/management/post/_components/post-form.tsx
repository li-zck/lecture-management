"use client";

import { useDepartments } from "@/components/ui/hooks/use-department";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
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
import { Checkbox } from "@/components/ui/shadcn/checkbox";
import { Input } from "@/components/ui/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";
import {
  createPostSchema,
  type CreatePostSchema,
} from "@/lib/zod/schemas/create/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface PostFormProps {
  initialValues?: Partial<CreatePostSchema & { id?: string }>;
  onSubmit: (values: CreatePostSchema) => Promise<void>;
  onDelete?: () => Promise<void>;
  mode: "create" | "edit";
}

export function PostForm({
  initialValues,
  onSubmit,
  onDelete,
  mode,
}: PostFormProps) {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const { departments } = useDepartments();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<CreatePostSchema>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: initialValues?.title ?? "",
      content: initialValues?.content ?? "",
      type: initialValues?.type ?? "NEWS",
      departmentId: initialValues?.departmentId ?? "none",
      thumbnail: initialValues?.thumbnail ?? "",
      isPublic: initialValues?.isPublic ?? false,
    },
  });

  const handleSubmit = async (values: CreatePostSchema) => {
    await onSubmit(values);
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>
            {mode === "create"
              ? dict.admin.posts.createPost
              : dict.admin.posts.editPost}
          </CardTitle>
          <CardDescription>
            {mode === "create"
              ? dict.admin.posts.writeNewDescLong
              : dict.admin.posts.updateDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit((values) => handleSubmit(values))}
            className="space-y-4"
          >
            <Controller
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="post-form-title">
                    {dict.admin.posts.postTitle}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="post-form-title"
                    aria-invalid={fieldState.invalid}
                    placeholder={dict.admin.posts.postTitlePlaceholder}
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
              name="content"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="post-form-content">
                    {dict.admin.posts.content}
                  </FieldLabel>
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    minHeight="240px"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="type"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="post-form-type">
                      {dict.admin.posts.type}
                    </FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="post-form-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper" sideOffset={5}>
                        <SelectItem value="NEWS">
                          {dict.admin.posts.news}
                        </SelectItem>
                        <SelectItem value="ANNOUNCEMENT">
                          {dict.admin.posts.announcement}
                        </SelectItem>
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
                name="departmentId"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="post-form-department">
                      {dict.admin.common.department}
                    </FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="post-form-department">
                        <SelectValue
                          placeholder={dict.admin.posts.selectDepartment}
                        />
                      </SelectTrigger>
                      <SelectContent position="popper" sideOffset={5}>
                        <SelectItem value="none">
                          {dict.admin.posts.globalAllDepts}
                        </SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
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
            </div>

            <Controller
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <Field>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="post-form-isPublic"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <FieldLabel
                      htmlFor="post-form-isPublic"
                      className="font-normal cursor-pointer"
                    >
                      {dict.admin.posts.publicDesc}
                    </FieldLabel>
                  </div>
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="thumbnail"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="post-form-thumbnail">
                    {dict.admin.posts.thumbnailUrl}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="post-form-thumbnail"
                    aria-invalid={fieldState.invalid}
                    placeholder={dict.admin.posts.thumbnailPlaceholder}
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
            onClick={form.handleSubmit((values) => handleSubmit(values))}
          >
            {mode === "create"
              ? dict.admin.posts.createPost
              : dict.admin.common.saveChanges}
          </Button>
        </CardFooter>
      </Card>

      {mode === "edit" && onDelete && (
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {dict.admin.common.confirmTitle}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {dict.admin.common.confirmDeleteBody.replace(
                  "{entity}",
                  "post",
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
      )}
    </div>
  );
}
