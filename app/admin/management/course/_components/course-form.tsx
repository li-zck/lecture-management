"use client";

import { useDepartments } from "@/components/ui/hooks/use-department";
import { Field, FieldError, FieldLabel } from "@/components/ui/shadcn";
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
import { createCourseSchema } from "@/lib/zod/schemas/create/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

type CourseFormValues = z.infer<typeof createCourseSchema>;

interface CourseFormProps {
  initialValues?: Partial<CourseFormValues>;
  onSubmit: (values: CourseFormValues) => Promise<void>;
  mode: "create" | "edit";
}

export function CourseForm({ initialValues, onSubmit, mode }: CourseFormProps) {
  const { departments } = useDepartments();

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      name: initialValues?.name || "",
      credits: initialValues?.credits || 3,
      departmentId: initialValues?.departmentId || undefined,
      semester: initialValues?.semester || "1",
      description: initialValues?.description || "",
      ...initialValues,
    },
  });

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>
            {mode === "create" ? "Create Course" : "Edit Course"}
          </CardTitle>
          <CardDescription>
            {mode === "create"
              ? "Fill in the details below to create a new course."
              : "Update the course information below."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="create-course-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="create-course-form-name">
                    Course Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="create-course-form-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Calculus I"
                    autoComplete="off"
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
                name="credits"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-course-form-credits">
                      Credits
                    </FieldLabel>
                    <Input
                      {...field}
                      id="create-course-form-credits"
                      type="number"
                      aria-invalid={fieldState.invalid}
                      placeholder="3"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      min={1}
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
                name="semester"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-course-form-semester">
                      Recommended Semester/Level
                    </FieldLabel>
                    <Input
                      {...field}
                      id="create-course-form-semester"
                      aria-invalid={fieldState.invalid}
                      placeholder="1"
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
              name="departmentId"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="create-course-form-departmentId">
                    Department
                  </FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger id="create-course-form-departmentId">
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={5}>
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

            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="create-course-form-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="create-course-form-description"
                    aria-invalid={fieldState.invalid}
                    placeholder="Describe the course..."
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
        <CardFooter className="flex justify-end">
          <Button
            type="button"
            disabled={form.formState.isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
          >
            {mode === "create" ? "Create Course" : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
