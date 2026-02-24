"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  DatePickerInput,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components/ui/shadcn";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";
import { createSemesterSchema } from "@/lib/zod/schemas/create/semester";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

function normalizeDateString(v: string | Date | undefined | null): string {
  if (v == null || v === "") return "";
  const s = typeof v === "string" ? v.trim() : v.toISOString().split("T")[0];
  return s.includes("T") ? s.split("T")[0] : s;
}

type SemesterFormValues = z.infer<typeof createSemesterSchema>;

interface SemesterFormProps {
  initialValues?: Partial<SemesterFormValues>;
  onSubmit: (values: SemesterFormValues) => Promise<void>;
  mode: "create" | "edit";
}

export function SemesterForm({
  initialValues,
  onSubmit,
  mode,
}: SemesterFormProps) {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const form = useForm<SemesterFormValues>({
    resolver: zodResolver(createSemesterSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      startDate: normalizeDateString(initialValues?.startDate),
      endDate: normalizeDateString(initialValues?.endDate),
    },
  });

  const handleSubmit = async (values: SemesterFormValues) => {
    // Validation ensures endDate > startDate
    await onSubmit(values);
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>
            {mode === "create"
              ? dict.admin.semesters.createSemester
              : dict.admin.semesters.editSemester}
          </CardTitle>
          <CardDescription>
            {mode === "create"
              ? dict.admin.common.fillDetails.replace("{entity}", "semester")
              : dict.admin.common.updateDetails.replace("{entity}", "semester")}
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dict.admin.semesters.semesterName}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          dict.admin.semesters.semesterNamePlaceholder
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dict.admin.common.startDate}</FormLabel>
                      <FormControl>
                        <DatePickerInput
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          placeholder={dict.admin.semesters.selectStartDate}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dict.admin.common.endDate}</FormLabel>
                      <FormControl>
                        <DatePickerInput
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          placeholder={dict.admin.semesters.selectEndDate}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {mode === "create"
                  ? dict.admin.semesters.createSemester
                  : dict.admin.common.saveChanges}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
