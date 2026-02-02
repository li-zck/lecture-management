import { z } from "zod";

export const createEnrollmentSessionSchema = z
	.object({
		name: z.string().optional(),
		semesterId: z.string().min(1, "Semester is required"),
		startDate: z.string().min(1, "Start date is required"),
		endDate: z.string().min(1, "End date is required"),
		isActive: z.boolean(),
	})
	.refine(
		(data) => {
			const start = new Date(data.startDate);
			const end = new Date(data.endDate);
			return end > start;
		},
		{
			message: "End date must be after start date",
			path: ["endDate"],
		},
	);

export type CreateEnrollmentSessionFormValues = z.infer<
	typeof createEnrollmentSessionSchema
>;
