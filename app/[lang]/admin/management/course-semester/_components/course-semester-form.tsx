"use client";

import { useCourses, useLecturers, useSemesters } from "@/components/ui/hooks";
import { Button } from "@/components/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/shadcn/form";
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
import { createCourseSemesterSchema } from "@/lib/zod/schemas/create/course-semester";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Define type manually to avoid z.coerce.number() inferring as `unknown`
type CourseSemesterFormValues = {
  courseId: string;
  semesterId: string;
  lecturerId?: string;
  dayOfWeek?: number;
  startTime?: number;
  endTime?: number;
  mode?: "ONLINE" | "ON_CAMPUS" | "HYBRID";
  location?: string;
  meetingUrl?: string;
  capacity?: number;
};

interface CourseSemesterFormProps {
  initialValues?: Partial<CourseSemesterFormValues>;
  onSubmit: (values: CourseSemesterFormValues) => Promise<void>;
  mode: "create" | "edit";
}

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function CourseSemesterForm({
  initialValues,
  onSubmit,
  mode,
}: CourseSemesterFormProps) {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const { courses } = useCourses();
  const { semesters } = useSemesters();
  const { lecturers } = useLecturers();

  const form = useForm<CourseSemesterFormValues>({
    // Cast needed because z.coerce.number() infers as `unknown`
    resolver: zodResolver(createCourseSemesterSchema) as any,
    defaultValues: {
      courseId: initialValues?.courseId ?? "",
      semesterId: initialValues?.semesterId ?? "",
      lecturerId: initialValues?.lecturerId ?? undefined,
      dayOfWeek: initialValues?.dayOfWeek,
      startTime: initialValues?.startTime,
      endTime: initialValues?.endTime,
      mode: initialValues?.mode ?? "ON_CAMPUS",
      location: initialValues?.location ?? "",
      meetingUrl: initialValues?.meetingUrl ?? "",
      capacity: initialValues?.capacity ?? 60,
    },
  });

  const handleSubmit = async (values: CourseSemesterFormValues) => {
    await onSubmit(values);
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>
            {mode === "create"
              ? dict.admin.courseSemesters.addSchedule
              : dict.admin.courseSemesters.editSchedule}
          </CardTitle>
          <CardDescription>
            {mode === "create"
              ? dict.admin.courseSemesters.addScheduleDesc
              : dict.admin.courseSemesters.editScheduleDesc}
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="courseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dict.admin.courseSemesters.course}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                        disabled={mode === "edit"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                dict.admin.courseSemesters.selectCourse
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent position="popper" sideOffset={5}>
                          {courses.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                        {dict.admin.courseSemesters.semester}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                        disabled={mode === "edit"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                dict.admin.courseSemesters.selectSemester
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent position="popper" sideOffset={5}>
                          {semesters.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="lecturerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {dict.admin.courseSemesters.lecturerOptional}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              dict.admin.courseSemesters.selectLecturer
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="popper" sideOffset={5}>
                        <SelectItem value="none">
                          {dict.admin.common.unassigned}
                        </SelectItem>
                        {lecturers.map((l) => (
                          <SelectItem key={l.id} value={l.id}>
                            {l.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="dayOfWeek"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {dict.admin.courseSemesters.dayOfWeek}
                      </FormLabel>
                      <Select
                        onValueChange={(val) => field.onChange(Number(val))}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={dict.admin.courseSemesters.selectDay}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent position="popper" sideOffset={5}>
                          {DAYS.map((day, index) => (
                            <SelectItem key={day} value={index.toString()}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {dict.admin.courseSemesters.startPeriod}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {dict.admin.courseSemesters.endPeriod}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="3"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {dict.admin.courseSemesters.mode ?? "Mode"}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? "ON_CAMPUS"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              dict.admin.courseSemesters.selectMode ??
                              "Select mode"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="popper" sideOffset={5}>
                        <SelectItem value="ON_CAMPUS">
                          {dict.admin.courseSemesters.modeOnCampus ??
                            "On campus"}
                        </SelectItem>
                        <SelectItem value="ONLINE">
                          {dict.admin.courseSemesters.modeOnline ?? "Online"}
                        </SelectItem>
                        <SelectItem value="HYBRID">
                          {dict.admin.courseSemesters.modeHybrid ?? "Hybrid"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {dict.admin.courseSemesters.location}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            dict.admin.courseSemesters.locationPlaceholder
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="meetingUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {dict.admin.courseSemesters.meetingUrl ?? "Meeting URL"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://meet.google.com/xxx-xxxx-xxx"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dict.admin.courseSemesters.capacity}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {mode === "create"
                  ? dict.admin.courseSemesters.addSchedule
                  : dict.admin.common.saveChanges}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
