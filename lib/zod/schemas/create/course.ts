import z from "zod";

export const createCourseSchema = z.object({
  name: z.string().min(1, "Course name cannot be empty"),
  credits: z
    .number()
    .min(1, "Credits must be at least 1")
    .max(10, "Credits must be less than 10"),
  departmentId: z.string().optional(),
  recommendedSemester: z.string().optional(),
  semesterId: z.string().optional(), // Semester to offer the course in (creates course-semester)
  description: z.string().min(1, "Course description cannot be empty"),
});
