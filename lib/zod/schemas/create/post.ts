import z from "zod";

export const postTypeEnum = z.enum(["NEWS", "ANNOUNCEMENT"]);

const stripHtml = (html: string) =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z
    .string()
    .refine((val) => stripHtml(val).length > 0, "Content is required"),
  type: postTypeEnum,
  departmentId: z.string().optional(),
  thumbnail: z.union([z.string().url(), z.literal("")]).optional(),
  isPublic: z.boolean(),
});

export type CreatePostSchema = z.infer<typeof createPostSchema>;
