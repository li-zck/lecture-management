"use client";

import { useSemesters } from "@/components/ui/hooks/use-semesters";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";
import {
  createEnrollmentSessionSchema,
  type CreateEnrollmentSessionFormValues,
} from "@/lib/zod/schemas/create/enrollment-session";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface EnrollmentSessionFormProps {
  initialValues?: Partial<CreateEnrollmentSessionFormValues>;
  onSubmit: (values: CreateEnrollmentSessionFormValues) => Promise<void>;
  mode: "create" | "edit";
}

export function EnrollmentSessionForm({
  initialValues,
  onSubmit,
  mode,
}: EnrollmentSessionFormProps) {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const { semesters, loading: semestersLoading } = useSemesters();

  const form = useForm<CreateEnrollmentSessionFormValues>({
    resolver: zodResolver(createEnrollmentSessionSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      semesterId: initialValues?.semesterId ?? "",
      startDate: initialValues?.startDate
        ? new Date(initialValues.startDate).toISOString().slice(0, 16)
        : "",
      endDate: initialValues?.endDate
        ? new Date(initialValues.endDate).toISOString().slice(0, 16)
        : "",
      isActive: initialValues?.isActive ?? false,
    },
  });

  const handleSubmit = async (values: CreateEnrollmentSessionFormValues) => {
    await onSubmit(values);
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>
            {mode === "create"
              ? dict.admin.enrollmentSessions.createSession
              : dict.admin.enrollmentSessions.editSession}
          </CardTitle>
          <CardDescription>
            {mode === "create"
              ? dict.admin.enrollmentSessions.createDesc
              : dict.admin.enrollmentSessions.editDesc}
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
                    <FormLabel>
                      {dict.admin.enrollmentSessions.sessionName}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          dict.admin.enrollmentSessions.sessionNamePlaceholder
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {dict.admin.enrollmentSessions.sessionNameHint}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="semesterId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {dict.admin.enrollmentSessions.semester}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={semestersLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              dict.admin.enrollmentSessions.selectSemester
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {semesters.map((semester) => (
                          <SelectItem key={semester.id} value={semester.id}>
                            {semester.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {dict.admin.enrollmentSessions.semesterFor}
                    </FormDescription>
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
                      <FormLabel>
                        {dict.admin.enrollmentSessions.startDateTime}
                      </FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormDescription>
                        {dict.admin.enrollmentSessions.whenOpens}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {dict.admin.enrollmentSessions.endDateTime}
                      </FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormDescription>
                        {dict.admin.enrollmentSessions.whenCloses}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        {dict.admin.enrollmentSessions.activeLabel}
                      </FormLabel>
                      <FormDescription>
                        {dict.admin.enrollmentSessions.activeHint}
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end mt-4">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {mode === "create"
                  ? dict.admin.enrollmentSessions.createSession
                  : dict.admin.common.saveChanges}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
