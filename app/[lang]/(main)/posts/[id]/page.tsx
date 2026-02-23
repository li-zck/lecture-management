"use client";

import { usePublicPost } from "@/components/ui/hooks/use-public-posts";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/shadcn/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function PostDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const lang = (params?.lang as string) || "en";
  const router = useRouter();
  const { post, loading, error } = usePublicPost(id, {
    includeAdmin: true,
    includeDepartment: true,
  });

  if (!id) {
    router.replace(`/${lang}/posts`);
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <PageHeader title="Post" description="Not found" />
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          Post not found or not available.
        </div>
        <Button variant="ghost" asChild className="mt-4">
          <Link href={`/${lang}/posts`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to posts
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Button variant="ghost" asChild className="mb-6 -ml-2">
        <Link href={`/${lang}/posts`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to posts
        </Link>
      </Button>

      <article>
        <header className="mb-6">
          <p className="text-sm text-muted-foreground">
            {post.type} · {new Date(post.createdAt).toLocaleDateString()}
            {post.admin?.username && <> · by {post.admin.username}</>}
            {post.department?.name && <> · {post.department.name}</>}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            {post.title}
          </h1>
        </header>

        {/* Admin-authored HTML from Tiptap (public posts only) */}
        <div
          className="prose prose-sm dark:prose-invert max-w-none [&_p]:mb-2 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:ml-4 [&_ol]:ml-4 [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base [&_strong]:font-bold [&_em]:italic"
          suppressHydrationWarning
          // biome-ignore lint/security/noDangerouslySetInnerHtml: admin-authored rich text from Tiptap
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
