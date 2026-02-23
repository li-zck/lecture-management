"use client";

import {
  lecturerNotificationApi,
  studentNotificationApi,
} from "@/lib/api/user-notification";
import { queryKeys } from "@/lib/query";
import { useQuery } from "@tanstack/react-query";

export type { UserNotification } from "@/lib/api/user-notification";
// Note: NotificationType is exported from use-admin-notifications.tsx (admin)

/**
 * Hook for fetching all student notifications
 */
export const useStudentNotifications = () => {
  const query = useQuery({
    queryKey: queryKeys.studentNotifications.lists(),
    queryFn: () => studentNotificationApi.getAll(),
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
 * Hook for fetching a single student notification by ID
 */
export const useStudentNotification = (id: string | null) => {
  const query = useQuery({
    queryKey: queryKeys.studentNotifications.detail(id ?? ""),
    queryFn: () => studentNotificationApi.getById(id ?? ""),
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
 * Hook for fetching all lecturer notifications
 */
export const useLecturerNotifications = () => {
  const query = useQuery({
    queryKey: queryKeys.lecturerNotifications.lists(),
    queryFn: () => lecturerNotificationApi.getAll(),
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
 * Hook for fetching a single lecturer notification by ID
 */
export const useLecturerNotification = (id: string | null) => {
  const query = useQuery({
    queryKey: queryKeys.lecturerNotifications.detail(id ?? ""),
    queryFn: () => lecturerNotificationApi.getById(id ?? ""),
    enabled: !!id,
  });

  return {
    notification: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
