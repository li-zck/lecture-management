"use client";

import { useDepartments } from "@/components/ui/hooks/use-department";
import { useFormPersistence } from "@/components/ui/hooks/use-form-persistence";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/shadcn";
import { Button } from "@/components/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { DatePickerInput } from "@/components/ui/shadcn/date-picker-input";
import { Input } from "@/components/ui/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { getErrorInfo, logError, parseValidationErrors } from "@/lib/api/error";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";
import { createStudentSchema } from "@/lib/zod/schemas/create/account";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Enhance schema for 'edit' mode where password fields are optional
const editStudentSchema = createStudentSchema
  .omit({ password: true })
  .extend({
    username: z.string().min(1, "Username cannot be empty"),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // If newPassword is provided, confirmPassword must match
      if (data.newPassword && data.newPassword !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

type StudentFormValues =
  | z.infer<typeof createStudentSchema>
  | z.infer<typeof editStudentSchema>;

interface StudentFormProps {
  initialValues?: Partial<z.infer<typeof createStudentSchema>>;
  onSubmit: (values: any) => Promise<void>;
  mode: "create" | "edit";
}

export function StudentForm({
  initialValues,
  onSubmit,
  mode,
}: StudentFormProps) {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const { departments } = useDepartments();

  const schema = mode === "edit" ? editStudentSchema : createStudentSchema;

  const getDefaultValues = (): StudentFormValues =>
    ({
      username: initialValues?.username ?? "",
      email: initialValues?.email ?? "",
      fullName: initialValues?.fullName ?? "",
      studentId: initialValues?.studentId ?? "",
      departmentId: initialValues?.departmentId ?? "",
      citizenId: initialValues?.citizenId ?? "",
      phone: initialValues?.phone ?? "",
      address: initialValues?.address ?? "",
      gender: initialValues?.gender ?? true,
      birthDate: initialValues?.birthDate ?? "",
      ...(mode === "create"
        ? { password: "" }
        : { newPassword: "", confirmPassword: "" }),
    }) as StudentFormValues;

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValues(),
  });

  // Persist form data across page reloads (only in create mode)
  const { clearPersistedData } = useFormPersistence({
    key: `student-form-${mode}`,
    form,
    exclude: ["password", "newPassword", "confirmPassword"], // Don't persist passwords
    enabled: mode === "create", // Only persist in create mode
  });

  const handleSubmit = async (values: StudentFormValues) => {
    try {
      await onSubmit(values);
      if (typeof clearPersistedData === "function") {
        clearPersistedData();
      }
    } catch (error: unknown) {
      logError(error, "Create/Update Student");
      const { status, message, details } = getErrorInfo(error);
      const fieldErrors = parseValidationErrors(details);
      if (fieldErrors.length > 0) {
        for (const { field, message } of fieldErrors) {
          if (field !== "root" && field in values) {
            form.setError(field as keyof StudentFormValues, {
              type: "server",
              message,
            });
          }
        }
        toast.error(message);
      } else {
        toast.error(
          status === 400
            ? message
            : dict.admin.common.checkInfo.replace("{entity}", "student"),
        );
      }
    }
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>
            {mode === "create"
              ? dict.admin.students.createAccount
              : dict.admin.students.editAccount}
          </CardTitle>
          <CardDescription>
            {mode === "create"
              ? dict.admin.common.fillDetails.replace(
                  "{entity}",
                  "student account",
                )
              : dict.admin.common.updateDetails.replace("{entity}", "student")}
          </CardDescription>
        </CardHeader>
        <form
          id="create-student-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <CardContent>
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="fullName"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="student-form-fullName">
                      {dict.admin.common.fullName}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="student-form-fullName"
                      aria-invalid={fieldState.invalid}
                      placeholder={dict.admin.students.fullNamePlaceholder}
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
                name="studentId"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="student-form-studentId">
                      {dict.admin.students.studentId}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="student-form-studentId"
                      aria-invalid={fieldState.invalid}
                      placeholder={dict.admin.students.studentIdPlaceholder}
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
                    <FieldLabel htmlFor="student-form-email">
                      {dict.admin.common.email}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="student-form-email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder={dict.admin.students.emailPlaceholder}
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
                    <FieldLabel htmlFor="student-form-username">
                      {dict.admin.common.username}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="student-form-username"
                      aria-invalid={fieldState.invalid}
                      placeholder={dict.admin.students.usernamePlaceholder}
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {mode === "create" ? (
                <Controller
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="student-form-password">
                        {dict.admin.common.password}
                      </FieldLabel>
                      <Input
                        {...field}
                        id="student-form-password"
                        type="password"
                        aria-invalid={fieldState.invalid}
                        placeholder={dict.admin.students.passwordPlaceholder}
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              ) : (
                <>
                  <Controller
                    control={form.control}
                    name="newPassword"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="student-form-newPassword">
                          {dict.admin.students.newPasswordLabel}
                        </FieldLabel>
                        <Input
                          {...field}
                          id="student-form-newPassword"
                          type="password"
                          aria-invalid={fieldState.invalid}
                          placeholder={dict.admin.students.passwordPlaceholder}
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
                    name="confirmPassword"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="student-form-confirmPassword">
                          {dict.admin.common.confirmPassword}
                        </FieldLabel>
                        <Input
                          {...field}
                          id="student-form-confirmPassword"
                          type="password"
                          aria-invalid={fieldState.invalid}
                          placeholder={dict.admin.students.passwordPlaceholder}
                          autoComplete="off"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </>
              )}

              <Controller
                control={form.control}
                name="departmentId"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="student-form-departmentId">
                      {dict.admin.common.department}
                    </FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <SelectTrigger id="student-form-departmentId">
                        <SelectValue
                          placeholder={dict.admin.common.selectDepartment}
                        />
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
                name="citizenId"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="student-form-citizenId">
                      {dict.admin.common.citizenId}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="student-form-citizenId"
                      aria-invalid={fieldState.invalid}
                      placeholder={dict.admin.students.citizenIdPlaceholder}
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
                name="phone"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="student-form-phone">
                      {dict.admin.common.phone}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="student-form-phone"
                      aria-invalid={fieldState.invalid}
                      placeholder={dict.admin.students.phonePlaceholder}
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
                    <FieldLabel htmlFor="student-form-gender">
                      {dict.admin.common.gender}
                    </FieldLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                      value={field.value?.toString()}
                      defaultValue={field.value?.toString()}
                    >
                      <SelectTrigger id="student-form-gender">
                        <SelectValue
                          placeholder={dict.admin.common.selectGender}
                        />
                      </SelectTrigger>
                      <SelectContent position="popper" sideOffset={5}>
                        <SelectItem value="true">
                          {dict.admin.common.male}
                        </SelectItem>
                        <SelectItem value="false">
                          {dict.admin.common.female}
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
                    <FieldLabel htmlFor="student-form-birthDate">
                      {dict.admin.common.birthDate}
                    </FieldLabel>
                    <DatePickerInput
                      id="student-form-birthDate"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder={dict.admin.students.birthDatePlaceholder}
                      aria-invalid={fieldState.invalid}
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
                    <FieldLabel htmlFor="student-form-address">
                      {dict.admin.students.addressLabel}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="student-form-address"
                      aria-invalid={fieldState.invalid}
                      placeholder={dict.admin.students.addressPlaceholder}
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              form="create-student-form"
            >
              {mode === "create"
                ? dict.admin.students.createAccount
                : dict.admin.common.saveChanges}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
