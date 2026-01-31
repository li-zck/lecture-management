"use client";

import { useQuery } from "@tanstack/react-query";
import {
	adminWebhookApi,
	type WebhookUserQuery,
} from "@/lib/api/admin-webhook";
import { queryKeys } from "@/lib/query";

export type {
	Webhook,
	WebhookLog,
	WebhookUserQuery,
} from "@/lib/api/admin-webhook";

/**
 * Hook for fetching all webhooks (admin)
 *
 * Webhooks are HTTP endpoints that receive POST requests when events occur.
 * Each webhook has a secret for signature verification.
 */
export const useWebhooks = () => {
	const query = useQuery({
		queryKey: queryKeys.webhooks.lists(),
		queryFn: () => adminWebhookApi.getAll(),
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
 * Hook for fetching a single webhook by ID (admin)
 */
export const useWebhook = (id: string | null) => {
	const query = useQuery({
		queryKey: queryKeys.webhooks.detail(id ?? ""),
		queryFn: () => adminWebhookApi.getById(id ?? ""),
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
 * Hook for fetching webhooks by user (student or lecturer) (admin)
 */
export const useWebhooksByUser = (params: WebhookUserQuery | null) => {
	const hasParams = params && (params.studentId || params.lecturerId);

	const query = useQuery({
		queryKey: queryKeys.webhooks.byUser(params ?? {}),
		queryFn: () => adminWebhookApi.getByUser(params ?? {}),
		enabled: !!hasParams,
	});

	return {
		webhooks: query.data ?? [],
		totalWebhooks: query.data?.length ?? 0,
		loading: query.isLoading,
		error: query.error,
		refetch: query.refetch,
	};
};
