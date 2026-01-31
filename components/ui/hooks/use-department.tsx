"use client";

import { useQuery } from "@tanstack/react-query";
import { adminDepartmentApi } from "@/lib/api";
import { queryKeys } from "@/lib/query";

export const useDepartments = () => {
	const query = useQuery({
		queryKey: queryKeys.departments.lists(),
		queryFn: () => adminDepartmentApi.getAll(),
	});

	return {
		departments: query.data ?? [],
		totalDepartments: query.data?.length ?? 0,
		loading: query.isLoading,
		error: query.error,
		refetch: query.refetch,
	};
};

/**
 * Hook for fetching a single department by ID (admin)
 */
export const useAdminDepartment = (id: string | null) => {
	const query = useQuery({
		queryKey: queryKeys.departments.detail(id ?? ""),
		queryFn: () => adminDepartmentApi.getById(id!),
		enabled: !!id,
	});

	return {
		department: query.data ?? null,
		loading: query.isLoading,
		error: query.error,
		refetch: query.refetch,
	};
};
