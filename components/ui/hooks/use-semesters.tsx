"use client";

import { adminSemesterApi } from "@/lib/api/admin-semester";
import { queryKeys } from "@/lib/query";
import { useQuery } from "@tanstack/react-query";

export const useSemesters = () => {
  const query = useQuery({
    queryKey: queryKeys.semesters.lists(),
    queryFn: () => adminSemesterApi.getAll(),
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
 * Hook for fetching a single semester by ID
 */
export const useSemester = (id: string | null) => {
  const query = useQuery({
    queryKey: queryKeys.semesters.detail(id ?? ""),
    queryFn: () => adminSemesterApi.getById(id!),
    enabled: !!id,
  });

  return {
    semester: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
