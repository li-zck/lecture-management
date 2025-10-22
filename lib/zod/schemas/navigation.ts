import { z } from "zod";

export const roleQuerySchema = z.object({
	role: z.enum(["student", "lecturer"]).optional(),
});
