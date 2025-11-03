import parsePhoneNumberFromString from "libphonenumber-js";
import z from "zod";

export const updateStudentSchema = z
  .object({
    studentId: z.string().min(1, "Student ID cannot be empty").optional(),
    departmentId: z.string().min(1, "Department ID cannot be empty").optional(),
    username: z.string().min(1, "Username cannot be empty").optional(),
    email: z.email("Invalid email format").optional(),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
    confirmPassword: z.string().optional(),
    fullName: z.string().min(1, "Full name cannot be empty").optional(),
    gender: z.boolean().optional(),
    birthDate: z.string(),
    citizenId: z.string().min(1, "Citizen ID cannot be empty").optional(),
    phone: z
      .string()
      .refine(
        (val) => {
          if (!val) return true;

          const num = parsePhoneNumberFromString(val, "VN");

          return num?.isValid() ?? false;
        },
        {
          message: "Invalid phone number format",
        },
      )
      .optional(),
    address: z.string().optional(),
    active: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && data.confirmPassword) {
        return data.newPassword === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    },
  );

export const updateLecturerSchema = z
  .object({
    lecturerId: z.string().min(1, "Lecturer ID cannot be empty"),
    username: z.string().min(1, "Username cannot be empty").optional(),
    email: z.email("Invalid email format").optional(),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
    confirmPassword: z.string().optional(),
    fullName: z.string().min(1, "Full name cannot be empty").optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && data.confirmPassword) {
        return data.newPassword === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    },
  );

export const updateDepartmentSchema = z.object({
  departmentId: z.string().min(1, "Department ID cannot be empty"),
  name: z.string().min(1, "Department name cannot be empty").optional(),
  description: z.string().optional(),
  headId: z.string().optional(),
});
