"use client";

import { adminEnrollmentApi } from "@/lib/api/admin-enrollment";
import { useQuery } from "@tanstack/react-query";

export type { Enrollment } from "@/lib/api/admin-enrollment";

/**
 * Hook for fetching all enrollments (admin) with optional includes
 */
export const useEnrollments = (params?: {
  includeStudent?: boolean;
  includeCourse?: boolean;
}) => {
  const query = useQuery({
    queryKey: ["admin", "enrollments", "list", params],
    queryFn: () =>
      adminEnrollmentApi.getAll({
        includeStudent: params?.includeStudent ?? true,
        includeCourse: params?.includeCourse ?? true,
      }),
  });

  return {
    enrollments: query.data ?? [],
    totalEnrollments: query.data?.length ?? 0,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
