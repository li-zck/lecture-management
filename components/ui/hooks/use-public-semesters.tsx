"use client";

import { semesterApi, type SemesterQueryParams } from "@/lib/api/semester";
import { queryKeys } from "@/lib/query";
import { useQuery } from "@tanstack/react-query";

export type { Semester, SemesterQueryParams } from "@/lib/api/semester";

/**
 * Hook for fetching all public semesters
 */
export const usePublicSemesters = (params?: SemesterQueryParams) => {
  const query = useQuery({
    queryKey: queryKeys.publicSemesters.lists(),
    queryFn: () => semesterApi.getAll(params),
  });

  return {
    semesters: query.data ?? [],
    totalSemesters: query.data?.length ?? 0,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook for fetching a single public semester by ID
 */
export const usePublicSemester = (
  id: string | null,
  params?: SemesterQueryParams,
) => {
  const query = useQuery({
    queryKey: queryKeys.publicSemesters.detail(id ?? ""),
    queryFn: () => semesterApi.getById(id!, params),
    enabled: !!id,
  });

  return {
    semester: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
