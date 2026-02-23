"use client";

import { adminEnrollmentSessionApi } from "@/lib/api/admin-enrollment-session";
import { queryKeys } from "@/lib/query";
import { useQuery } from "@tanstack/react-query";

export type { EnrollmentSession } from "@/lib/api/admin-enrollment-session";

/**
 * Hook for fetching all enrollment sessions (admin)
 */
export const useEnrollmentSessions = () => {
  const query = useQuery({
    queryKey: queryKeys.enrollmentSessions.lists(),
    queryFn: () => adminEnrollmentSessionApi.getAll(),
  });

  return {
    enrollmentSessions: query.data ?? [],
    totalEnrollmentSessions: query.data?.length ?? 0,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook for fetching a single enrollment session by ID (admin)
 */
export const useEnrollmentSession = (id: string | null) => {
  const query = useQuery({
    queryKey: queryKeys.enrollmentSessions.detail(id ?? ""),
    queryFn: () => adminEnrollmentSessionApi.getById(id!),
    enabled: !!id,
  });

  return {
    enrollmentSession: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook for fetching enrollment sessions by semester ID (admin)
 */
export const useEnrollmentSessionsBySemester = (semesterId: string | null) => {
  const query = useQuery({
    queryKey: queryKeys.enrollmentSessions.bySemester(semesterId ?? ""),
    queryFn: () => adminEnrollmentSessionApi.getBySemester(semesterId!),
    enabled: !!semesterId,
  });

  return {
    enrollmentSessions: query.data ?? [],
    totalEnrollmentSessions: query.data?.length ?? 0,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
