"use client";

import { adminPostApi } from "@/lib/api/admin-post";
import { queryKeys } from "@/lib/query";
import { useQuery } from "@tanstack/react-query";

export type { Post, PostQueryParams, PostType } from "@/lib/api/admin-post";

/**
 * Hook for fetching all posts (admin)
 */
export const usePosts = (includeRelations = true) => {
  const query = useQuery({
    queryKey: queryKeys.posts.lists(),
    queryFn: () =>
      adminPostApi.getAll({
        includeAdmin: includeRelations,
        includeDepartment: includeRelations,
      }),
  });

  return {
    posts: query.data ?? [],
    totalPosts: query.data?.length ?? 0,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook for fetching a single post by ID (admin)
 */
export const usePost = (id: string | null, includeRelations = true) => {
  const query = useQuery({
    queryKey: queryKeys.posts.detail(id ?? ""),
    queryFn: () =>
      adminPostApi.getById(id ?? "", {
        includeAdmin: includeRelations,
        includeDepartment: includeRelations,
      }),
    enabled: !!id,
  });

  return {
    post: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook for fetching posts by department (admin)
 */
export const usePostsByDepartment = (
  departmentId: string | null,
  includeRelations = true,
) => {
  const query = useQuery({
    queryKey: queryKeys.posts.byDepartment(departmentId ?? ""),
    queryFn: () =>
      adminPostApi.getByDepartment(departmentId ?? "", {
        includeAdmin: includeRelations,
        includeDepartment: includeRelations,
      }),
    enabled: !!departmentId,
  });

  return {
    posts: query.data ?? [],
    totalPosts: query.data?.length ?? 0,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook for fetching global posts (no department) (admin)
 */
export const useGlobalPosts = (includeRelations = true) => {
  const query = useQuery({
    queryKey: queryKeys.posts.global(),
    queryFn: () =>
      adminPostApi.getGlobal({
        includeAdmin: includeRelations,
        includeDepartment: includeRelations,
      }),
  });

  return {
    posts: query.data ?? [],
    totalPosts: query.data?.length ?? 0,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
