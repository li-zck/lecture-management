"use client";

import { adminLecturerApi } from "@/lib/api";
import { queryKeys } from "@/lib/query";
import { useQuery } from "@tanstack/react-query";

export const useLecturers = () => {
  const query = useQuery({
    queryKey: queryKeys.lecturers.lists(),
    queryFn: () => adminLecturerApi.getAll(),
  });

  return {
    lecturers: query.data ?? [],
    totalLecturers: query.data?.length ?? 0,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook for fetching a single lecturer by ID
 */
export const useLecturer = (id: string | null) => {
  const query = useQuery({
    queryKey: queryKeys.lecturers.detail(id ?? ""),
    queryFn: () => adminLecturerApi.getById(id!),
    enabled: !!id,
  });

  return {
    lecturer: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
