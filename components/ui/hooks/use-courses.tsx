"use client";

import { useQuery } from "@tanstack/react-query";
import { adminCourseApi } from "@/lib/api/admin-course";
import { queryKeys } from "@/lib/query";

export const useCourses = () => {
	const query = useQuery({
		queryKey: queryKeys.courses.lists(),
		queryFn: () => adminCourseApi.getAll({ includeDepartment: true }),
	});

	return {
		courses: query.data ?? [],
		totalCourses: query.data?.length ?? 0,
		loading: query.isLoading,
		error: query.error,
		refetch: query.refetch,
	};
};

/**
 * Hook for fetching a single course by ID (admin)
 */
export const useAdminCourse = (id: string | null) => {
	const query = useQuery({
		queryKey: queryKeys.courses.detail(id ?? ""),
		queryFn: () => adminCourseApi.getById(id!, { includeDepartment: true }),
		enabled: !!id,
	});

	return {
		course: query.data ?? null,
		loading: query.isLoading,
		error: query.error,
		refetch: query.refetch,
	};
};
