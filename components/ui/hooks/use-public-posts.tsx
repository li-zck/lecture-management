"use client";

import { useQuery } from "@tanstack/react-query";
import { postApi, type PostQueryParams } from "@/lib/api/post";
import { queryKeys } from "@/lib/query";

export type { PublicPost } from "@/lib/api/post";
// Note: PostType and PostQueryParams are exported from use-posts.tsx (admin)

/**
 * Hook for fetching global public posts
 */
export const usePublicGlobalPosts = (params?: PostQueryParams) => {
	const query = useQuery({
		queryKey: queryKeys.publicPosts.global(),
		queryFn: () => postApi.getGlobal(params),
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
 * Hook for fetching public posts by department
 */
export const usePublicPostsByDepartment = (
	departmentId: string | null,
	params?: PostQueryParams,
) => {
	const query = useQuery({
		queryKey: queryKeys.publicPosts.byDepartment(departmentId ?? ""),
		queryFn: () => postApi.getByDepartment(departmentId ?? "", params),
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
 * Hook for fetching a single public post by ID
 */
export const usePublicPost = (id: string | null, params?: PostQueryParams) => {
	const query = useQuery({
		queryKey: queryKeys.publicPosts.detail(id ?? ""),
		queryFn: () => postApi.getById(id ?? "", params),
		enabled: !!id,
	});

	return {
		post: query.data ?? null,
		loading: query.isLoading,
		error: query.error,
		refetch: query.refetch,
	};
};
