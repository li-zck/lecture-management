import z from "zod";

export const createAdminSchema = z
	.object({
		username: z.string().min(1, "Username cannot be empty"),
		password: z.string().min(1, "Password cannot be empty"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});
