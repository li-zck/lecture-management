"use client";

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
import { createLecturerSchema } from "@/lib/zod/schemas/create/account";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const editLecturerSchema = createLecturerSchema.extend({
  password: z.string().optional(),
  username: z.string().min(1, "Username cannot be empty"),
});

type LecturerFormValues =
  | z.infer<typeof createLecturerSchema>
  | z.infer<typeof editLecturerSchema>;

interface LecturerFormProps {
  initialValues?: Partial<z.infer<typeof createLecturerSchema>>;
  onSubmit: (values: any) => Promise<void>;
  mode: "create" | "edit";
}

export function LecturerForm({
  initialValues,
  onSubmit,
  mode,
}: LecturerFormProps) {
  const schema = mode === "edit" ? editLecturerSchema : createLecturerSchema;

  const form = useForm<LecturerFormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      username: initialValues?.username || "",
      email: initialValues?.email || "",
      password: "",
      fullName: initialValues?.fullName || "",
      lecturerId: initialValues?.lecturerId || "",
      ...initialValues,
    } as any,
  });

  const handleSubmit = async (values: LecturerFormValues) => {
    await onSubmit(values);
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>
            {mode === "create"
              ? "Create Lecturer Account"
              : "Edit Lecturer Account"}
          </CardTitle>
          <CardDescription>
            {mode === "create"
              ? "Fill in the details below to create a new lecturer account."
              : "Update the lecturer information below."}
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
                name="fullName"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="lecturer-form-fullName">
                      Full Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="lecturer-form-fullName"
                      aria-invalid={fieldState.invalid}
                      placeholder="Dr. Nguyen Van B"
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
                name="lecturerId"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="lecturer-form-lecturerId">
                      Lecturer ID
                    </FieldLabel>
                    <Input
                      {...field}
                      id="lecturer-form-lecturerId"
                      aria-invalid={fieldState.invalid}
                      placeholder="GV123"
                      disabled={mode === "edit"}
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
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="lecturer-form-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="lecturer-form-email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="b@example.com"
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
                name="username"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="lecturer-form-username">
                      Username
                    </FieldLabel>
                    <Input
                      {...field}
                      id="lecturer-form-username"
                      aria-invalid={fieldState.invalid}
                      placeholder="username"
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
                name="password"
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="md:col-span-2"
                  >
                    <FieldLabel htmlFor="lecturer-form-password">
                      Password{" "}
                      {mode === "edit" && "(Leave blank to keep unchanged)"}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="lecturer-form-password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="********"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            type="button"
            disabled={form.formState.isSubmitting}
            onClick={form.handleSubmit(handleSubmit as any)}
          >
            {mode === "create" ? "Create Lecturer" : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
