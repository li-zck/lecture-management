"use client";

import {
  adminNotificationApi,
  type NotificationUserQuery,
} from "@/lib/api/admin-notification";
import { queryKeys } from "@/lib/query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type {
  Notification,
  NotificationType,
  NotificationUserQuery,
} from "@/lib/api/admin-notification";

export const adminNotificationKeys = {
  all: ["admin-notifications"] as const,
  adminBroadcast: () =>
    [...adminNotificationKeys.all, "admin-broadcast"] as const,
};

export function useAdminNotifications() {
  const {
    data: notifications = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: adminNotificationKeys.adminBroadcast(),
    queryFn: () => adminNotificationApi.getAdminBroadcast(),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    refetch,
  };
}

export function useMarkAdminBroadcastAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => adminNotificationApi.markAllAdminBroadcastAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminNotificationKeys.all });
    },
  });
}

export function useDeleteAdminNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminNotificationApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminNotificationKeys.all });
    },
  });
}

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
