import z from "zod";

export const createDepartmentSchema = z.object({
	name: z.string().min(1, "Department name cannot be empty"),
	description: z.string().optional(),
	headId: z.string().optional(),
});
