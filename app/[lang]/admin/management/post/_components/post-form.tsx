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
            {mode === "create" ? "Create Post" : "Edit Post"}
          </CardTitle>
          <CardDescription>
            {mode === "create"
              ? "Write a new post or announcement."
              : "Update the post content below."}
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
                  <FieldLabel htmlFor="post-form-title">Title</FieldLabel>
                  <Input
                    {...field}
                    id="post-form-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Post title"
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
                  <FieldLabel htmlFor="post-form-content">Content</FieldLabel>
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
                    <FieldLabel htmlFor="post-form-type">Type</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="post-form-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper" sideOffset={5}>
                        <SelectItem value="NEWS">News</SelectItem>
                        <SelectItem value="ANNOUNCEMENT">
                          Announcement
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
                      Department
                    </FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="post-form-department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent position="popper" sideOffset={5}>
                        <SelectItem value="none">
                          Global (all departments)
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
                      Public (visible to everyone without login)
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
                    Thumbnail URL (optional)
                  </FieldLabel>
                  <Input
                    {...field}
                    id="post-form-thumbnail"
                    aria-invalid={fieldState.invalid}
                    placeholder="https://example.com/image.jpg"
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
              Delete
            </Button>
          ) : (
            <div />
          )}
          <Button
            type="button"
            disabled={form.formState.isSubmitting || isDeleting}
            onClick={form.handleSubmit((values) => handleSubmit(values))}
          >
            {mode === "create" ? "Create Post" : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>

      {mode === "edit" && onDelete && (
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                post.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                Cancel
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
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
