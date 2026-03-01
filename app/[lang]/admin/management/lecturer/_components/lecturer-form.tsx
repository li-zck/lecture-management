"use client";

import { useDepartments } from "@/components/ui/hooks/use-department";
import { useFormPersistence } from "@/components/ui/hooks/use-form-persistence";
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
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";
import { createLecturerSchema } from "@/lib/zod/schemas/create/account";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const editLecturerSchema = createLecturerSchema.extend({
  password: z.string().optional(),
  username: z.string().min(1, "Username cannot be empty"),
  departmentHeadId: z.string().nullable().optional(),
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
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const { departments } = useDepartments();
  const schema = mode === "edit" ? editLecturerSchema : createLecturerSchema;

  const init = initialValues as
    | {
        departmentHead?: { id: string };
        departmentHeadId?: string;
        gender?: boolean | null;
        birthDate?: string | null;
        citizenId?: string | null;
        phone?: string | null;
        address?: string | null;
      }
    | undefined;

  const form = useForm<LecturerFormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      username: initialValues?.username ?? "",
      email: initialValues?.email ?? "",
      password: "",
      fullName: initialValues?.fullName ?? "",
      lecturerId: initialValues?.lecturerId ?? "",
      departmentHeadId:
        (mode === "edit" && init?.departmentHead?.id) ??
        (mode === "edit" && init?.departmentHeadId) ??
        "__none__",
      gender: init?.gender ?? undefined,
      birthDate: init?.birthDate ? init.birthDate.slice(0, 10) : "",
      citizenId: init?.citizenId ?? "",
      phone: init?.phone ?? "",
      address: init?.address ?? "",
    } as any,
  });

  // Persist form data across page reloads (only in create mode)
  const { clearPersistedData } = useFormPersistence({
    key: `lecturer-form-${mode}`,
    form,
    exclude: ["password"], // Don't persist password
    enabled: mode === "create", // Only persist in create mode
  });

  const handleSubmit = async (values: LecturerFormValues) => {
    await onSubmit(values);
    // Clear persisted data after successful submission
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
              ? dict.admin.lecturers.createAccount
              : dict.admin.lecturers.editAccount}
          </CardTitle>
          <CardDescription>
            {mode === "create"
              ? dict.admin.common.fillDetails.replace(
                  "{entity}",
                  "lecturer account",
                )
              : dict.admin.common.updateDetails.replace("{entity}", "lecturer")}
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
                      {dict.admin.common.fullName}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="lecturer-form-fullName"
                      aria-invalid={fieldState.invalid}
                      placeholder={dict.admin.lecturers.fullNamePlaceholder}
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
                      {dict.admin.lecturers.lecturerId}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="lecturer-form-lecturerId"
                      aria-invalid={fieldState.invalid}
                      placeholder={dict.admin.lecturers.lecturerIdPlaceholder}
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
                    <FieldLabel htmlFor="lecturer-form-email">
                      {dict.admin.common.email}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="lecturer-form-email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder={dict.admin.lecturers.emailPlaceholder}
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
                      {dict.admin.common.username}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="lecturer-form-username"
                      aria-invalid={fieldState.invalid}
                      placeholder={dict.admin.common.username.toLowerCase()}
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
                      {dict.admin.common.password}{" "}
                      {mode === "edit" &&
                        `(${dict.admin.common.newPasswordHint})`}
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

              {mode === "edit" && (
                <Controller
                  control={form.control}
                  name="departmentHeadId"
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="md:col-span-2"
                    >
                      <FieldLabel htmlFor="lecturer-form-departmentHeadId">
                        {dict.admin.lecturers.assignDeptHead}
                      </FieldLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value === "__none__" ? null : value)
                        }
                        value={field.value ?? "__none__"}
                      >
                        <SelectTrigger id="lecturer-form-departmentHeadId">
                          <SelectValue
                            placeholder={dict.admin.lecturers.noneDeptHead}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">
                            {dict.admin.common.none}
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
              )}

              <Controller
                control={form.control}
                name="phone"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="lecturer-form-phone">
                      {dict.admin.common.phone}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="lecturer-form-phone"
                      type="tel"
                      aria-invalid={fieldState.invalid}
                      placeholder={
                        dict.admin.students?.phonePlaceholder ?? "+84..."
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
                name="address"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="lecturer-form-address">
                      {dict.admin.common.address}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="lecturer-form-address"
                      aria-invalid={fieldState.invalid}
                      placeholder={
                        dict.admin.students?.addressPlaceholder ??
                        "123 Street..."
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
                name="gender"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="lecturer-form-gender">
                      {dict.admin.common.gender}
                    </FieldLabel>
                    <Select
                      onValueChange={(v) =>
                        field.onChange(
                          v === "male"
                            ? true
                            : v === "female"
                              ? false
                              : undefined,
                        )
                      }
                      value={
                        (field.value as "male" | "female" | "__none__") ||
                        "__none__"
                      }
                    >
                      <SelectTrigger id="lecturer-form-gender">
                        <SelectValue placeholder={dict.admin.common.none} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">
                          {dict.admin.common.none}
                        </SelectItem>
                        <SelectItem value="male">
                          {dict.settings.genderMale}
                        </SelectItem>
                        <SelectItem value="female">
                          {dict.settings.genderFemale}
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
                name="birthDate"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="lecturer-form-birthDate">
                      {dict.admin.common.birthDate}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="lecturer-form-birthDate"
                      type="date"
                      aria-invalid={fieldState.invalid}
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
                name="citizenId"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="lecturer-form-citizenId">
                      {dict.admin.common.citizenId}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="lecturer-form-citizenId"
                      aria-invalid={fieldState.invalid}
                      placeholder={
                        dict.admin.students?.citizenIdPlaceholder ?? "123456789"
                      }
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
            {mode === "create"
              ? dict.admin.lecturers.createAccount
              : dict.admin.common.saveChanges}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
