"use client";

import {
  courseSemesterApi,
  type CourseSemesterQueryParams,
} from "@/lib/api/course-semester";
import { queryKeys } from "@/lib/query";
import { useQuery } from "@tanstack/react-query";

export type {
  CourseSemester,
  CourseSemesterQueryParams,
} from "@/lib/api/course-semester";

/**
 * Build a stable query key from params (primitives only) so that inline
 * objects from callers do not cause a new key every render and trigger
 * infinite refetches.
 */
function publicCourseSemestersListKey(params?: CourseSemesterQueryParams) {
  return [
    ...queryKeys.publicCourseSemesters.lists(),
    params?.courseId ?? null,
    params?.semesterId ?? null,
    params?.includeCourses ?? false,
    params?.includeSemesters ?? false,
    params?.includeLecturer ?? false,
    params?.includeEnrollmentCount ?? false,
  ] as const;
}

/**
 * Hook for fetching all public course-semesters.
 * Uses refetchOnWindowFocus and a short staleTime so new offerings appear
 * after creation without a full page reload.
 */
export const usePublicCourseSemesters = (
  params?: CourseSemesterQueryParams,
) => {
  const query = useQuery({
    queryKey: publicCourseSemestersListKey(params),
    queryFn: () => courseSemesterApi.getAll(params),
    refetchOnWindowFocus: true,
    staleTime: 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });

  return {
    data: query.data ?? [],
    courseSemesters: query.data ?? [],
    totalCourseSemesters: query.data?.length ?? 0,
    isLoading: query.isLoading,
    loading: query.isLoading,
    isRefetching: query.isRefetching,
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
