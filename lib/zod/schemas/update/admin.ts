import z from "zod";

export const updateAdminSchema = z
  .object({
    username: z.string().min(1, "Username cannot be empty").optional(),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
    confirmPassword: z.string().optional(),
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
