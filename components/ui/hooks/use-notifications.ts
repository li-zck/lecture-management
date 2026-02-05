"use client";

import { useSession } from "@/components/provider/SessionProvider";
import {
  lecturerNotificationApi,
  studentNotificationApi,
  type UserNotification,
} from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type { UserNotification };

/**
 * Query keys for notifications
 */
export const notificationKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationKeys.all, "list"] as const,
  detail: (id: string) => [...notificationKeys.all, "detail", id] as const,
};

/**
 * Hook to fetch notifications for the current user (student or lecturer)
 */
export function useNotifications() {
  const { user, isAuthenticated } = useSession();
  const role = user?.role?.toLowerCase();
  const isStudent = role === "student";
  const isLecturer = role === "lecturer";

  const {
    data: notifications = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: notificationKeys.list(),
    queryFn: async () => {
      if (isStudent) {
        return studentNotificationApi.getAll();
      }
      if (isLecturer) {
        return lecturerNotificationApi.getAll();
      }
      return [];
    },
    enabled: isAuthenticated && (isStudent || isLecturer),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every 60 seconds for real-time updates
  });

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to delete a notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const role = user?.role?.toLowerCase();
  const isStudent = role === "student";

  return useMutation({
    mutationFn: async (id: string) => {
      if (isStudent) {
        return studentNotificationApi.delete(id);
      }
      return lecturerNotificationApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

/**
 * Hook to delete all notifications
 */
export function useDeleteAllNotifications() {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const role = user?.role?.toLowerCase();
  const isStudent = role === "student";

  return useMutation({
    mutationFn: async () => {
      if (isStudent) {
        return studentNotificationApi.deleteAll();
      }
      return lecturerNotificationApi.deleteAll();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

/**
 * Hook to mark all notifications as read (e.g. when opening the bell dropdown)
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const role = user?.role?.toLowerCase();
  const isStudent = role === "student";

  return useMutation({
    mutationFn: async () => {
      if (isStudent) {
        return studentNotificationApi.markAllAsRead();
      }
      return lecturerNotificationApi.markAllAsRead();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
