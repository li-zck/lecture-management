"use client";

import { usePosts } from "@/components/ui/hooks/use-posts";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/shadcn/button";
import { DataTable } from "@/components/ui/table/DataTable";
import { adminPostApi, type Post } from "@/lib/api/admin-post";
import { sortByUpdatedAtDesc } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import { columns } from "./columns";

export default function PostManagementPage() {
  const { posts, loading, refetch } = usePosts();
  const router = useRouter();
  const sortedPosts = useMemo(() => sortByUpdatedAtDesc(posts), [posts]);

  const handleBulkDelete = async (
    selectedItems: Post[],
    onSuccess?: () => void,
  ) => {
    try {
      const ids = selectedItems.map((item) => item.id);
      await adminPostApi.deleteMultiple(ids);
      toast.success(`Successfully deleted ${selectedItems.length} post(s)`);
      refetch();
      router.refresh();
      onSuccess?.();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Failed to delete posts");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Posts"
        description="Create and manage posts and announcements."
        action={
          <Button asChild>
            <Link href="/admin/management/post/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Post
            </Link>
          </Button>
        }
      />

      <div className="w-full">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-muted-foreground">Loading posts...</div>
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
