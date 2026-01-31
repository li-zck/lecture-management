"use client";

import { useQuery } from "@tanstack/react-query";
import {
	courseSemesterApi,
	type CourseSemesterQueryParams,
} from "@/lib/api/course-semester";
import { queryKeys } from "@/lib/query";

export type {
	CourseSemester,
	CourseSemesterQueryParams,
} from "@/lib/api/course-semester";

/**
 * Hook for fetching all public course-semesters
 */
export const usePublicCourseSemesters = (
	params?: CourseSemesterQueryParams,
) => {
	const query = useQuery({
		queryKey: queryKeys.publicCourseSemesters.list({
			courseId: params?.courseId,
			semesterId: params?.semesterId,
		}),
		queryFn: () => courseSemesterApi.getAll(params),
	});

	return {
		courseSemesters: query.data ?? [],
		totalCourseSemesters: query.data?.length ?? 0,
		loading: query.isLoading,
		error: query.error,
		refetch: query.refetch,
	};
};

/**
 * Hook for fetching a single public course-semester by ID
 */
export const usePublicCourseSemester = (
	id: string | null,
	params?: Omit<CourseSemesterQueryParams, "courseId" | "semesterId">,
) => {
	const query = useQuery({
		queryKey: queryKeys.publicCourseSemesters.detail(id ?? ""),
		queryFn: () => courseSemesterApi.getById(id!, params),
		enabled: !!id,
	});

	return {
		courseSemester: query.data ?? null,
		loading: query.isLoading,
		error: query.error,
		refetch: query.refetch,
	};
};
