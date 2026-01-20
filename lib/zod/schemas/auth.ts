import { z } from "zod";

export const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters long")
	.max(1000, "Password must be less than 1000 characters long")
	.regex(
		/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
		"Password must contain at least one number, one uppercase, and one lowercase letter",
	);

export const emailSchema = z.email().transform((email) => email.toLowerCase());

export const resetPasswordSchema = z
	.object({
		token: z.string().min(1),
		password: passwordSchema,
		confirmPassword: z.string(),
	})
	.refine((data) => data.confirmPassword === data.password, {
		message: "Confirm password must match",
		path: ["confirmPassword"],
	});

export const updatePasswordSchema = z
	.object({
		currentPassword: z.string().min(1),
		newPassword: passwordSchema,
	})
	.refine((data) => data.currentPassword !== data.newPassword, {
		message: "New password must be different from the current password",
		path: ["newPassword"],
	});

export const signInStudentSchema = z.object({
	username: z.string().min(1, "Student ID is required"),
	password: z.string(),
});

export const signInLecturerSchema = z.object({
	username: z.string().min(1, "Lecturer ID is required"),
	password: z.string(),
});

export const signInAdminSchema = z.object({
	username: z.string(),
	password: z.string(),
});

export const signUpSchema = z
	.object({
		username: z.string().min(1, "Username cannot be blank"),
		// password: passwordSchema,
		password: z.string().min(1, "Password cannot be blank"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.confirmPassword === data.password, {
		message: "Confirm password must match",
		path: ["confirmPassword"],
	});

export const requestPasswordResetSchema = z.object({
	email: emailSchema,
});
