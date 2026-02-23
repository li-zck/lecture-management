"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminPostApi } from "@/lib/api/admin-post";
import { getErrorInfo, logError } from "@/lib/api/error";
import { type CreatePostSchema } from "@/lib/zod/schemas/create/post";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PostForm } from "../_components/post-form";

export default function CreatePostPage() {
  const router = useRouter();

  const handleSubmit = async (values: CreatePostSchema) => {
    try {
      const payload = {
        title: values.title,
        content: values.content,
        type: values.type,
        departmentId:
          values.departmentId && values.departmentId !== "none"
            ? values.departmentId
            : undefined,
        thumbnail: values.thumbnail?.trim()
          ? values.thumbnail.trim()
          : undefined,
        isPublic: values.isPublic ?? false,
      };

      await adminPostApi.create(payload);
      toast.success("Post created successfully");
      router.push("/admin/management/post");
      router.refresh();
    } catch (error: unknown) {
      const { message } = getErrorInfo(error);
      logError(error, "Create Post");
      toast.error(message || "Failed to create post");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Post"
        description="Write a new post or announcement"
      />
      <PostForm onSubmit={handleSubmit} mode="create" />
    </div>
  );
}
