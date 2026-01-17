import z from "zod";

export const createCourseSemesterSchema = z.object({
    courseId: z.string().min(1, "Course is required"),
    semesterId: z.string().min(1, "Semester is required"),
    lecturerId: z.string().optional(),
    dayOfWeek: z.coerce.number().min(0).max(6).optional(), // 0=Sunday, 1=Monday?
    startTime: z.coerce.number().optional(), // Period or time
    endTime: z.coerce.number().optional(),
    location: z.string().optional(),
    capacity: z.coerce.number().min(1).optional(),
});
