"use client";

import { lecturerWebhookApi, studentWebhookApi } from "@/lib/api/user-webhook";
import { queryKeys } from "@/lib/query";
import { useQuery } from "@tanstack/react-query";

export type { UserWebhook } from "@/lib/api/user-webhook";

/**
 * Hook for fetching all student webhooks
 */
export const useStudentWebhooks = () => {
  const query = useQuery({
    queryKey: queryKeys.studentWebhooks.lists(),
    queryFn: () => studentWebhookApi.getAll(),
  });

  return {
    webhooks: query.data ?? [],
    totalWebhooks: query.data?.length ?? 0,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook for fetching a single student webhook by ID
 */
export const useStudentWebhook = (id: string | null) => {
  const query = useQuery({
    queryKey: queryKeys.studentWebhooks.detail(id ?? ""),
    queryFn: () => studentWebhookApi.getById(id ?? ""),
    enabled: !!id,
  });

  return {
    webhook: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook for fetching all lecturer webhooks
 */
export const useLecturerWebhooks = () => {
  const query = useQuery({
    queryKey: queryKeys.lecturerWebhooks.lists(),
    queryFn: () => lecturerWebhookApi.getAll(),
  });

  return {
    webhooks: query.data ?? [],
    totalWebhooks: query.data?.length ?? 0,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook for fetching a single lecturer webhook by ID
 */
export const useLecturerWebhook = (id: string | null) => {
  const query = useQuery({
    queryKey: queryKeys.lecturerWebhooks.detail(id ?? ""),
    queryFn: () => lecturerWebhookApi.getById(id ?? ""),
    enabled: !!id,
  });

  return {
    webhook: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
