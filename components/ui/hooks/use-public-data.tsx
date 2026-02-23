"use client";

import { useSession } from "@/components/provider/SessionProvider";
import { courseApi } from "@/lib/api/course";
import { departmentApi } from "@/lib/api/department";
import { queryKeys } from "@/lib/query";
import { useQuery } from "@tanstack/react-query";

// Re-export types for convenience
export type { Course } from "@/lib/api/course";
export type { Department } from "@/lib/api/department";

/**
 * Hook options for public data queries
 */
interface UseDataOptions {
  /** Whether to fetch data (default: true) */
  enabled?: boolean;
  /** Whether to require authentication (default: true) */
  requireAuth?: boolean;
}

/**
 * Hook for fetching all courses
 * Can be used by any authenticated user
 */
export function useAllCourses(options: UseDataOptions = {}) {
  const { enabled = true, requireAuth = true } = options;
  const { isAuthenticated, isLoading: sessionLoading } = useSession();

  const shouldFetch =
    enabled && !sessionLoading && (!requireAuth || isAuthenticated);

  return useQuery({
    queryKey: queryKeys.courses.lists(),
    queryFn: () => courseApi.getAll({ includeDepartment: true }),
    enabled: shouldFetch,
    select: (data) => ({
      data,
      total: data.length,
    }),
  });
}

/**
 * Hook for fetching all departments
 * Can be used by any authenticated user
 */
export function useAllDepartments(options: UseDataOptions = {}) {
  const { enabled = true, requireAuth = true } = options;
  const { isAuthenticated, isLoading: sessionLoading } = useSession();

  const shouldFetch =
    enabled && !sessionLoading && (!requireAuth || isAuthenticated);

  return useQuery({
    queryKey: queryKeys.departments.lists(),
    queryFn: () => departmentApi.getAll(),
    enabled: shouldFetch,
    select: (data) => ({
      data,
      total: data.length,
    }),
  });
}

/**
 * Hook for fetching a single course by ID
 */
export function useCourse(id: string | null, options: UseDataOptions = {}) {
  const { enabled = true, requireAuth = true } = options;
  const { isAuthenticated, isLoading: sessionLoading } = useSession();

  const shouldFetch =
    enabled && !sessionLoading && !!id && (!requireAuth || isAuthenticated);

  return useQuery({
    queryKey: queryKeys.courses.detail(id ?? ""),
    queryFn: () => courseApi.getById(id!, true),
    enabled: shouldFetch,
  });
}

/**
 * Hook for fetching a single department by ID
 */
export function useDepartment(id: string | null, options: UseDataOptions = {}) {
  const { enabled = true, requireAuth = true } = options;
  const { isAuthenticated, isLoading: sessionLoading } = useSession();

  const shouldFetch =
    enabled && !sessionLoading && !!id && (!requireAuth || isAuthenticated);

  return useQuery({
    queryKey: queryKeys.departments.detail(id ?? ""),
    queryFn: () => departmentApi.getById(id!),
    enabled: shouldFetch,
  });
}

/**
 * Hook for fetching courses by department
 */
export function useCoursesByDepartment(
  departmentId: string | null,
  options: UseDataOptions = {},
) {
  const { enabled = true, requireAuth = true } = options;
  const { isAuthenticated, isLoading: sessionLoading } = useSession();

  const shouldFetch =
    enabled &&
    !sessionLoading &&
    !!departmentId &&
    (!requireAuth || isAuthenticated);

  return useQuery({
    queryKey: queryKeys.courses.byDepartment(departmentId ?? ""),
    queryFn: () => courseApi.getByDepartment(departmentId!, true),
    enabled: shouldFetch,
    select: (data) => ({
      data,
      total: data.length,
    }),
  });
}
