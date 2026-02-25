"use client";

import { usePublicGlobalPosts } from "@/components/ui/hooks/use-public-posts";
import { PageHeader } from "@/components/ui/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { getClientDictionary, isLocale } from "@/lib/i18n";
import { FileText } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PostsPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const locale = isLocale(lang) ? lang : "en";
  const dict = getClientDictionary(locale);
  const { posts, loading, error } = usePublicGlobalPosts({
    includeAdmin: true,
    includeDepartment: false,
  });

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <PageHeader title="Posts" description="News and announcements" />
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <PageHeader title="Posts" description="News and announcements" />
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          Failed to load posts. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <PageHeader title="Posts" description={dict.posts.description} />

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center text-muted-foreground">
          <FileText className="mb-4 h-12 w-12" />
          <p>{dict.posts.noPostsYet}</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/${lang}/posts/${post.id}`}>
                <Card className="transition-colors hover:bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-1 text-lg">
                      {post.title}
                    </CardTitle>
                    <CardDescription>
                      {post.type} ·{" "}
                      {new Date(post.createdAt).toLocaleDateString()}
                      {post.admin?.username && <> · by {post.admin.username}</>}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {(() => {
                        const text = post.content
                          .replace(/<[^>]*>/g, " ")
                          .replace(/\s+/g, " ")
                          .trim();
                        return text.length > 160
                          ? `${text.slice(0, 160)}...`
                          : text;
                      })()}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
