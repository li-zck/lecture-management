"use client";

import { useQuery } from "@tanstack/react-query";
import {
	adminNotificationApi,
	type NotificationUserQuery,
} from "@/lib/api/admin-notification";
import { queryKeys } from "@/lib/query";

export type {
	Notification,
	NotificationType,
	NotificationUserQuery,
} from "@/lib/api/admin-notification";

/**
 * Hook for fetching all notifications (admin)
 */
export const useNotifications = () => {
	const query = useQuery({
		queryKey: queryKeys.notifications.lists(),
		queryFn: () => adminNotificationApi.getAll(),
	});

	return {
		notifications: query.data ?? [],
		totalNotifications: query.data?.length ?? 0,
		loading: query.isLoading,
		error: query.error,
		refetch: query.refetch,
	};
};

/**
 * Hook for fetching a single notification by ID (admin)
 */
export const useNotification = (id: string | null) => {
	const query = useQuery({
		queryKey: queryKeys.notifications.detail(id ?? ""),
		queryFn: () => adminNotificationApi.getById(id!),
		enabled: !!id,
	});

	return {
		notification: query.data ?? null,
		loading: query.isLoading,
		error: query.error,
		refetch: query.refetch,
	};
};

/**
 * Hook for fetching notifications by user (student or lecturer) (admin)
 */
export const useNotificationsByUser = (
	params: NotificationUserQuery | null,
) => {
	const hasParams = params && (params.studentId || params.lecturerId);

	const query = useQuery({
		queryKey: queryKeys.notifications.byUser(params ?? {}),
		queryFn: () => adminNotificationApi.getByUser(params!),
		enabled: !!hasParams,
	});

	return {
		notifications: query.data ?? [],
		totalNotifications: query.data?.length ?? 0,
		loading: query.isLoading,
		error: query.error,
		refetch: query.refetch,
	};
};
