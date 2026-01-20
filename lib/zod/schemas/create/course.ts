import z from "zod";

export const createCourseSchema = z.object({
  name: z.string().min(1, "Course name cannot be empty"),
  credits: z.number().min(1, "Credits must be at least 1"),
  departmentId: z.string().optional(),
  semester: z.string().min(1, "Semester is required"), // Course metadata semester (e.g. "1")
  description: z.string().optional(),
});
