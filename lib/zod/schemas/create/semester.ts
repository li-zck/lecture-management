import z from "zod";

export const createSemesterSchema = z.object({
    name: z.string().min(1, "Semester name cannot be empty"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
}).refine((data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end > start;
}, {
    message: "End date must be after start date",
    path: ["endDate"],
});
