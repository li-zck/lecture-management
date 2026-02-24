"use client";

import { usePosts } from "@/components/ui/hooks/use-posts";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/shadcn/button";
import { DataTable } from "@/components/ui/table/DataTable";
import { adminPostApi, type Post } from "@/lib/api/admin-post";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale, useLocalePath } from "@/lib/i18n/use-locale";
import { sortByUpdatedAtDesc } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import { getColumns } from "./columns";

export default function PostManagementPage() {
  const locale = useLocale();
  const localePath = useLocalePath();
  const dict = getClientDictionary(locale);
  const { posts, loading, refetch } = usePosts();
  const router = useRouter();
  const sortedPosts = useMemo(() => sortByUpdatedAtDesc(posts), [posts]);
  const columns = useMemo(() => getColumns(dict), [dict]);

  const handleBulkDelete = async (
    selectedItems: Post[],
    onSuccess?: () => void,
  ) => {
    try {
      const ids = selectedItems.map((item) => item.id);
      await adminPostApi.deleteMultiple(ids);
      toast.success(
        dict.admin.common.bulkDeleteSuccess
          .replace("{count}", String(selectedItems.length))
          .replace("{entity}", "post(s)"),
      );
      refetch();
      router.refresh();
      onSuccess?.();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(
        err?.message ||
          dict.admin.common.bulkDeleteFailed.replace("{entity}", "posts"),
      );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={dict.admin.posts.title}
        description={dict.admin.posts.description}
        action={
          <Button asChild>
            <Link href={localePath("admin/management/post/create")}>
              <Plus className="mr-2 h-4 w-4" />
              {dict.admin.posts.createPost}
            </Link>
          </Button>
        }
      />

      <div className="w-full">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-muted-foreground">
              {dict.admin.posts.loadingPosts}
            </div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={sortedPosts}
            entityType="post"
            filterColumn="title"
            bulkDeleteHandlerAction={handleBulkDelete}
          />
        )}
      </div>
    </div>
  );
}
