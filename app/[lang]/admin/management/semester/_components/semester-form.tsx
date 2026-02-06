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
            {mode === "create" ? "Create Semester" : "Edit Semester"}
          </CardTitle>
          <CardDescription>
            {mode === "create"
              ? "Fill in the details below to create a new semester."
              : "Update the semester information below."}
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
                    <FormLabel>Semester Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Spring 2026" {...field} />
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
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <DatePickerInput
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          placeholder="Select start date"
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
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <DatePickerInput
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          placeholder="Select end date"
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
                {mode === "create" ? "Create Semester" : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
