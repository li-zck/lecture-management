"use client";

import { PageHeader } from "@/components/ui/page-header";
import { adminPostApi } from "@/lib/api/admin-post";
import { getErrorInfo, logError } from "@/lib/api/error";
import { queryKeys } from "@/lib/query";
import type { CreatePostSchema } from "@/lib/zod/schemas/create/post";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { PostForm } from "../_components/post-form";

export default function EditPostPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<Partial<
    CreatePostSchema & { id?: string }
  > | null>(null);
  const hasShownErrorRef = useRef(false);

  useEffect(() => {
    if (!id) {
      router.push("/admin/management/post");
    }
  }, [id, router]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setInitialValues(null);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function fetchPost() {
      try {
        const data = await adminPostApi.getById(id, {
          includeAdmin: true,
          includeDepartment: true,
        });
        if (cancelled || data.id !== id) return;
        setInitialValues({
          title: data.title,
          content: data.content,
          type: data.type,
          departmentId: data.departmentId ?? "none",
          thumbnail: data.thumbnail ?? "",
          isPublic: data.isPublic ?? false,
        });
      } catch (error) {
        if (cancelled) return;
        logError(error, "Fetch Post");
        if (!hasShownErrorRef.current) {
          toast.error("Failed to load post");
          hasShownErrorRef.current = true;
        }
        router.push("/admin/management/post");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchPost();
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  const handleSubmit = async (values: CreatePostSchema) => {
    try {
      const payload = {
        title: values.title,
        content: values.content,
        type: values.type,
        departmentId:
          values.departmentId && values.departmentId !== "none"
            ? values.departmentId
            : null,
        thumbnail: values.thumbnail?.trim() ? values.thumbnail.trim() : null,
        isPublic: values.isPublic ?? false,
      };

      await adminPostApi.update(id, payload);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.posts.all,
      });
      toast.success("Post updated successfully");
      router.back();
      router.refresh();
    } catch (error: unknown) {
      const { message } = getErrorInfo(error);
      logError(error, "Update Post");
      toast.error(message || "Failed to update post");
    }
  };

  const handleDelete = async () => {
    try {
      await adminPostApi.delete(id);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.posts.all,
      });
      toast.success("Post deleted successfully");
      router.back();
      router.refresh();
    } catch (error: unknown) {
      const { message } = getErrorInfo(error);
      logError(error, "Delete Post");
      toast.error(message || "Failed to delete post");
    }
  };

  if (!id) {
    return null;
  }

  if (loading || !initialValues) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Post"
        description={`Edit "${initialValues.title ?? "Post"}"`}
      />
      <PostForm
        key={id}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        mode="edit"
        initialValues={initialValues}
      />
    </div>
  );
}
