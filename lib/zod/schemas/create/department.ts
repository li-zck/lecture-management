import z from "zod";

export const createDepartmentSchema = z.object({
	departmentId: z.string().min(1, "Department ID cannot be empty"),
	name: z.string().min(1, "Department name cannot be empty"),
	description: z.string().min(1, "Department description cannot be empty"),
	headId: z.string().optional(),
});
