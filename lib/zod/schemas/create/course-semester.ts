import z from "zod";

export const SCHEDULE_MODES = ["ONLINE", "ON_CAMPUS", "HYBRID"] as const;
export type ScheduleMode = (typeof SCHEDULE_MODES)[number];

export const createCourseSemesterSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  semesterId: z.string().min(1, "Semester is required"),
  lecturerId: z
    .string()
    .nullish()
    .transform((val) => (val === "none" || !val ? undefined : val)),
  dayOfWeek: z.coerce.number().min(0).max(6).optional(), // 0=Sunday, 1=Monday?
  startTime: z.coerce.number().optional(), // Period or time
  endTime: z.coerce.number().optional(),
  mode: z.enum(SCHEDULE_MODES).optional(),
  location: z.string().optional(),
  meetingUrl: z
    .string()
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  capacity: z.coerce.number().min(1).optional(),
});
