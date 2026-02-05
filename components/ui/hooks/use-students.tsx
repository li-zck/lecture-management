"use client";

import { adminStudentApi } from "@/lib/api";
import { queryKeys } from "@/lib/query";
import { useQuery } from "@tanstack/react-query";

export const useStudents = () => {
  const query = useQuery({
    queryKey: queryKeys.students.lists(),
    queryFn: () => adminStudentApi.getAll(),
  });

  return {
    students: query.data ?? [],
    totalStudents: query.data?.length ?? 0,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook for fetching a single student by ID
 */
export const useStudent = (id: string | null) => {
  const query = useQuery({
    queryKey: queryKeys.students.detail(id ?? ""),
    queryFn: () => adminStudentApi.getById(id ?? ""),
    enabled: !!id,
  });

  return {
    student: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
