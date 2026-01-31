"use client";

import { useQuery } from "@tanstack/react-query";
import { enrollmentSessionApi } from "@/lib/api/enrollment-session";
import { queryKeys } from "@/lib/query";

// Note: EnrollmentSession type is exported from use-enrollment-sessions.tsx (admin)
// Use that type for consistency, or import directly from @/lib/api/enrollment-session

/**
 * Hook for fetching all active enrollment sessions
 */
export const useActiveEnrollmentSessions = () => {
	const query = useQuery({
		queryKey: queryKeys.activeEnrollmentSessions.lists(),
		queryFn: () => enrollmentSessionApi.getAllActive(),
	});

	return {
		sessions: query.data ?? [],
		totalSessions: query.data?.length ?? 0,
		loading: query.isLoading,
		error: query.error,
		refetch: query.refetch,
	};
};

/**
 * Hook for fetching a single active enrollment session by ID
 */
export const useActiveEnrollmentSession = (id: string | null) => {
	const query = useQuery({
		queryKey: queryKeys.activeEnrollmentSessions.detail(id ?? ""),
		queryFn: () => enrollmentSessionApi.getActiveById(id ?? ""),
		enabled: !!id,
	});

	return {
		session: query.data ?? null,
		loading: query.isLoading,
		error: query.error,
		refetch: query.refetch,
	};
};

/**
 * Hook for fetching active enrollment sessions by semester
 */
export const useActiveEnrollmentSessionsBySemester = (
	semesterId: string | null,
) => {
	const query = useQuery({
		queryKey: queryKeys.activeEnrollmentSessions.bySemester(semesterId ?? ""),
		queryFn: () => enrollmentSessionApi.getActiveBySemester(semesterId ?? ""),
		enabled: !!semesterId,
	});

	return {
		sessions: query.data ?? [],
		totalSessions: query.data?.length ?? 0,
		loading: query.isLoading,
		error: query.error,
		refetch: query.refetch,
	};
};
