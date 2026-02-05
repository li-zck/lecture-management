import parsePhoneNumberFromString from "libphonenumber-js";
import z from "zod";

export const createStudentSchema = z.object({
  studentId: z.string().min(1, "Student ID cannot be empty"),
  departmentId: z.string().min(1, "Department cannot be empty"),
  username: z.string().min(1, "Username cannot be empty"),
  email: z.email(),
  // password: passwordSchema,
  password: z.string().min(1, "Password cannot be empty"),
  fullName: z.string().min(1, "Full name cannot be empty"),
  gender: z.boolean(),
  birthDate: z
    .string()
    .min(1, "Birth date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid birth date format")
    .refine((v) => {
      const [y, m, d] = v.split("-").map(Number);
      const date = new Date(Date.UTC(y, m - 1, d));
      return (
        date.getUTCFullYear() === y &&
        date.getUTCMonth() === m - 1 &&
        date.getUTCDate() === d &&
        y >= 1900 &&
        y <= new Date().getUTCFullYear()
      );
    }, "Year must be between 1900 and the current year"),
  citizenId: z.string().min(1, "Citizen ID cannot be empty"),
  // Match backend @IsPhoneNumber("VN"): valid and must be a Vietnam number
  phone: z.string().refine(
    (val) => {
      const num = parsePhoneNumberFromString(val, "VN");
      if (!num?.isValid()) return false;
      return num.country === "VN";
    },
    { message: "Invalid phone number format" },
  ),
  address: z.string().optional(),
});

export const createLecturerSchema = z.object({
  lecturerId: z.string().min(1, "Lecturer ID cannot be empty"),
  fullName: z.string().min(1, "Full name cannot be empty"),
  email: z.email(),
  username: z.string().min(1, "Username cannot be empty"),
  // password: passwordSchema
  password: z.string().min(1, "Password cannot be empty"),
});
