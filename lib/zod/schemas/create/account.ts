import z from "zod";
import { passwordSchema } from "../auth";
import parsePhoneNumberFromString from "libphonenumber-js";

export const createStudentSchema = z.object({
	departmentId: z.string().min(1, "Department ID cannot be empty"),
	username: z.string().min(1, "Username cannot be empty"),
	email: z.email(),
	// password: passwordSchema,
	password: z.string().min(1, "Password cannot be empty"),
	studentId: z.string().min(1, "Student ID cannot be empty"),
	fullName: z.string().min(1, "Full name cannot be empty"),
	gender: z.boolean(),
	birthDate: z.date(),
	citizenId: z.string().min(1, "Citizen ID cannot be empty"),
	phone: z.string().refine(
		(val) => {
			const num = parsePhoneNumberFromString(val, "VN");

			return num?.isValid() ?? false;
		},
		{
			message: "Invalid phone number format",
		},
	),
	address: z.string().optional(),
});

export const createLecturerSchema = z.object({
	fullName: z.string().min(1, "Full name cannot be empty"),
	email: z.email(),
	username: z.string().min(1, "Username cannot be empty"),
	// password: passwordSchema
	password: z.string().min(1, "Password cannot be empty"),
});
