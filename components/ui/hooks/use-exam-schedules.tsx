"use client";

import { useQuery } from "@tanstack/react-query";
import { adminExamScheduleApi } from "@/lib/api/admin-exam-schedule";
import { queryKeys } from "@/lib/query";

export type { ExamSchedule } from "@/lib/api/admin-exam-schedule";

/**
 * Hook for fetching all exam schedules (admin)
 */
export const useExamSchedules = () => {
	const query = useQuery({
		queryKey: queryKeys.examSchedules.lists(),
		queryFn: () => adminExamScheduleApi.getAll(),
	});

	return {
		examSchedules: query.data ?? [],
		totalExamSchedules: query.data?.length ?? 0,
		loading: query.isLoading,
		error: query.error,
		refetch: query.refetch,
	};
};

/**
 * Hook for fetching a single exam schedule by ID (admin)
 */
export const useExamSchedule = (id: string | null) => {
	const query = useQuery({
		queryKey: queryKeys.examSchedules.detail(id ?? ""),
		queryFn: () => adminExamScheduleApi.getById(id ?? ""),
		enabled: !!id,
	});

	return {
		examSchedule: query.data ?? null,
		loading: query.isLoading,
		error: query.error,
		refetch: query.refetch,
	};
};
