"use client";

import { adminCourseSemesterApi } from "@/lib/api/admin-course-semester";
import { queryKeys } from "@/lib/query";
import { useQuery } from "@tanstack/react-query";

export const useCourseSemesters = () => {
  const query = useQuery({
    queryKey: queryKeys.courseSemesters.lists(),
    queryFn: () => adminCourseSemesterApi.getAll(),
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
 * Hook for fetching a single course semester by ID
 */
export const useCourseSemester = (id: string | null) => {
  const query = useQuery({
    queryKey: queryKeys.courseSemesters.detail(id ?? ""),
    queryFn: () => adminCourseSemesterApi.getById(id!),
    enabled: !!id,
  });

  return {
    courseSemester: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
