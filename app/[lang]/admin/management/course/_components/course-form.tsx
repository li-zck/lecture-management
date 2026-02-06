"use client";

import { useDepartments } from "@/components/ui/hooks/use-department";
import { useSemesters } from "@/components/ui/hooks/use-semesters";
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
import { adminCourseSemesterApi } from "@/lib/api/admin-course-semester";
import { queryKeys } from "@/lib/query";
import { createCourseSchema } from "@/lib/zod/schemas/create/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type CourseFormValues = z.infer<typeof createCourseSchema>;

/** Single offering (course-on-semester) for edit form */
type CourseOffering = {
  id: string;
  semesterId: string;
  semester: { id: string; name: string };
};

const EMPTY_OFFERINGS: CourseOffering[] = [];

/** Semesters that are currently open (current date between startDate and endDate) */
function useOpenSemesters() {
  const { semesters } = useSemesters();
  return useMemo(() => {
    const now = new Date();
    return semesters.filter((s) => {
      const start = new Date(s.startDate);
      const end = new Date(s.endDate);
      return now >= start && now <= end;
    });
  }, [semesters]);
}

interface CourseFormProps {
  initialValues?: Partial<CourseFormValues>;
  onSubmit: (values: CourseFormValues) => Promise<void>;
  mode: "create" | "edit";
  /** For edit mode: course id (enables Offered in section) */
  courseId?: string;
  /** For edit mode: current course-on-semester offerings */
  initialOfferings?: CourseOffering[];
}

export function CourseForm({
  initialValues,
  onSubmit,
  mode,
  courseId,
  initialOfferings,
}: CourseFormProps) {
  const queryClient = useQueryClient();
  const { departments } = useDepartments();
  const openSemesters = useOpenSemesters();
  const { semesters: allSemesters } = useSemesters();
  const resolvedInitial = initialOfferings ?? EMPTY_OFFERINGS;
  const [offerings, setOfferings] = useState<CourseOffering[]>(resolvedInitial);
  const [offeringBusy, setOfferingBusy] = useState<string | null>(null);
  const [addSemesterValue, setAddSemesterValue] = useState<string>("");

  useEffect(() => {
    setOfferings(initialOfferings ?? EMPTY_OFFERINGS);
  }, [initialOfferings]);

  const offeredSemesterIds = useMemo(
    () => new Set(offerings.map((o) => o.semesterId)),
    [offerings],
  );
  const semestersToAdd = useMemo(
    () =>
      [...allSemesters]
        .sort((a, b) => b.name.localeCompare(a.name))
        .filter((s) => !offeredSemesterIds.has(s.id)),
    [allSemesters, offeredSemesterIds],
  );

  const addOffering = async (semesterId: string) => {
    if (!courseId) return;
    setOfferingBusy(semesterId);
    try {
      const created = await adminCourseSemesterApi.create({
        courseId,
        semesterId,
      });
      const semester = allSemesters.find((s) => s.id === semesterId);
      setOfferings((prev) => [
        ...prev,
        {
          id: created.id,
          semesterId: created.semesterId,
          semester: created.semester
            ? { id: created.semester.id, name: created.semester.name }
            : semester
              ? { id: semester.id, name: semester.name }
              : { id: semesterId, name: semesterId },
        },
      ]);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.courseSemesters.all,
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
      toast.success("Offering added");
    } catch {
      toast.error("Failed to add offering");
    } finally {
      setOfferingBusy(null);
    }
  };

  const removeOffering = async (offeringId: string) => {
    setOfferingBusy(offeringId);
    try {
      await adminCourseSemesterApi.delete(offeringId);
      setOfferings((prev) => prev.filter((o) => o.id !== offeringId));
      await queryClient.invalidateQueries({
        queryKey: queryKeys.courseSemesters.all,
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
      toast.success("Offering removed");
    } catch {
      toast.error("Failed to remove offering");
    } finally {
      setOfferingBusy(null);
    }
  };

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      credits: initialValues?.credits ?? 1,
      departmentId: initialValues?.departmentId ?? undefined,
      recommendedSemester: initialValues?.recommendedSemester ?? "",
      semesterId: initialValues?.semesterId ?? "",
      description: initialValues?.description ?? "",
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
                      max={10}
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
                name="recommendedSemester"
                render={({ field, fieldState }) => {
                  const currentValue = field.value;
                  const options = openSemesters.map((s) => ({
                    value: s.name,
                    label: s.name,
                  }));
                  const hasCurrentInOptions = options.some(
                    (o) => o.value === currentValue,
                  );
                  const selectOptions =
                    currentValue && !hasCurrentInOptions
                      ? [
                          { value: currentValue, label: currentValue },
                          ...options,
                        ]
                      : options;
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="create-course-form-recommendedSemester">
                        Recommended Semester/Level
                      </FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={selectOptions.length === 0}
                      >
                        <SelectTrigger id="create-course-form-recommendedSemester">
                          <SelectValue
                            placeholder={
                              selectOptions.length === 0
                                ? "No open semesters"
                                : "Optional"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent position="popper" sideOffset={5}>
                          {selectOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Optional. When the course is typically taken. Separate
                        from &quot;Offer in semester&quot; below.
                      </p>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />
            </div>

            {mode === "create" && (
              <Controller
                control={form.control}
                name="semesterId"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-course-form-semesterId">
                      Offer in semester
                    </FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || "none"}
                    >
                      <SelectTrigger id="create-course-form-semesterId">
                        <SelectValue placeholder="Select semester (optional)" />
                      </SelectTrigger>
                      <SelectContent position="popper" sideOffset={5}>
                        <SelectItem value="none">— Don't assign yet</SelectItem>
                        {[...allSemesters]
                          .sort((a, b) => b.name.localeCompare(a.name))
                          .map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Assigning a semester makes this course appear in the
                      catalog and on the course-semester page immediately.
                    </p>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}

            {mode === "edit" && courseId && (
              <Field>
                <FieldLabel>Offered in</FieldLabel>
                <p className="text-xs text-muted-foreground mb-2">
                  Semesters when this course is available. Add or remove
                  offerings below.
                </p>
                {offerings.length > 0 && (
                  <ul className="space-y-1.5 mb-2">
                    {offerings.map((o) => (
                      <li
                        key={o.id}
                        className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-sm"
                      >
                        <span>{o.semester.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          disabled={offeringBusy !== null}
                          onClick={() => removeOffering(o.id)}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
                {semestersToAdd.length > 0 && (
                  <Select
                    value={addSemesterValue}
                    onValueChange={(value) => {
                      if (value) {
                        addOffering(value);
                        setAddSemesterValue("");
                      }
                    }}
                    disabled={offeringBusy !== null}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Add semester..." />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={5}>
                      {semestersToAdd.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {offerings.length === 0 && semestersToAdd.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No semesters to add. This course is already offered in all
                    semesters.
                  </p>
                )}
              </Field>
            )}

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
