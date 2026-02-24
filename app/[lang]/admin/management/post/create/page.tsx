"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminPostApi } from "@/lib/api/admin-post";
import { getErrorInfo, logError } from "@/lib/api/error";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";
import { type CreatePostSchema } from "@/lib/zod/schemas/create/post";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PostForm } from "../_components/post-form";

export default function CreatePostPage() {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
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
      toast.success(
        dict.admin.common.createdSuccess.replace("{entity}", "Post"),
      );
      router.push("/admin/management/post");
      router.refresh();
    } catch (error: unknown) {
      const { message } = getErrorInfo(error);
      logError(error, "Create Post");
      toast.error(
        message || dict.admin.common.createFailed.replace("{entity}", "post"),
      );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={dict.admin.posts.createPost}
        description={dict.admin.posts.writeNewDesc}
      />
      <PostForm onSubmit={handleSubmit} mode="create" />
    </div>
  );
}
