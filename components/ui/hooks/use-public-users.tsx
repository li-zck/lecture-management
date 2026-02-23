"use client";

import { publicLecturerApi } from "@/lib/api/public-lecturer";
import { publicStudentApi } from "@/lib/api/public-student";
import { queryKeys } from "@/lib/query";
import { useQuery } from "@tanstack/react-query";

export type { PublicLecturer } from "@/lib/api/public-lecturer";
export type { PublicStudent } from "@/lib/api/public-student";

/**
 * Hook for fetching all public students
 */
export const usePublicStudents = () => {
  const query = useQuery({
    queryKey: queryKeys.publicStudents.lists(),
    queryFn: () => publicStudentApi.getAll(),
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
 * Hook for fetching a single public student by ID
 */
export const usePublicStudent = (id: string | null) => {
  const query = useQuery({
    queryKey: queryKeys.publicStudents.detail(id ?? ""),
    queryFn: () => publicStudentApi.getById(id!),
    enabled: !!id,
  });

  return {
    student: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook for fetching all public lecturers
 */
export const usePublicLecturers = () => {
  const query = useQuery({
    queryKey: queryKeys.publicLecturers.lists(),
    queryFn: () => publicLecturerApi.getAll(),
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
 * Hook for fetching a single public lecturer by ID
 */
export const usePublicLecturer = (id: string | null) => {
  const query = useQuery({
    queryKey: queryKeys.publicLecturers.detail(id ?? ""),
    queryFn: () => publicLecturerApi.getById(id!),
    enabled: !!id,
  });

  return {
    lecturer: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
