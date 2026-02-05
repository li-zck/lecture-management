import { apiClient } from "./client";

/**
 * Webhook interface
 *
 * Webhooks are used to send HTTP POST requests to external URLs
 * when certain events occur (e.g., notifications).
 *
 * Security: Each webhook has an auto-generated secret used to create
 * HMAC-SHA256 signatures. The signature is sent in the X-Webhook-Signature header.
 */
export interface Webhook {
  id: string;
  url: string;
  /** Auto-generated secret for HMAC-SHA256 signature verification */
  secret: string | null;
  isActive: boolean;
  studentId: string | null;
  student?: {
    id: string;
    fullName: string | null;
    studentId: string | null;
  } | null;
  lecturerId: string | null;
  lecturer?: {
    id: string;
    fullName: string | null;
    lecturerId: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Webhook log entry interface
 *
 * Records all webhook delivery attempts for auditing and debugging.
 */
export interface WebhookLog {
  id: string;
  webhookId: string;
  /** Event type (e.g., "notification") */
  event: string;
  /** JSON payload sent to the webhook URL */
  payload: Record<string, unknown>;
  /** HTTP response status code (null if request failed) */
  statusCode: number | null;
  /** Response body from the webhook endpoint */
  responseBody: string | null;
  /** Request duration in milliseconds */
  duration: number;
  createdAt: string;
}

/**
 * Create webhook request DTO
 */
export interface CreateWebhookRequest {
  /** Webhook endpoint URL (must be a valid URL) */
  url: string;
  /** Whether the webhook is active (default: true) */
  isActive?: boolean;
  /** Associate with a student (mutually exclusive with lecturerId) */
  studentId?: string;
  /** Associate with a lecturer (mutually exclusive with studentId) */
  lecturerId?: string;
}

/**
 * Update webhook request DTO
 */
export interface UpdateWebhookRequest {
  url?: string;
  isActive?: boolean;
  studentId?: string | null;
  lecturerId?: string | null;
}

/**
 * Query parameters for fetching webhooks by user
 */
export interface WebhookUserQuery extends Record<string, unknown> {
  lecturerId?: string;
  studentId?: string;
}

/**
 * Admin Webhook Management API
 *
 * Webhooks allow external systems to receive notifications when events occur.
 * Each webhook:
 * - Has a unique URL where POST requests are sent
 * - Has an auto-generated secret for signature verification
 * - Can be associated with a student or lecturer
 * - Logs all delivery attempts
 *
 * All endpoints require admin authentication.
 */
export const adminWebhookApi = {
  /**
   * GET /admin/webhook/all - Get all webhooks
   */
  getAll: async (): Promise<Webhook[]> => {
    const response = await apiClient.get<Webhook[]>("/admin/webhook/all");
    return response.data;
  },

  /**
   * GET /admin/webhook/user - Get webhooks by user (lecturerId or studentId)
   */
  getByUser: async (params: WebhookUserQuery): Promise<Webhook[]> => {
    const response = await apiClient.get<Webhook[]>("/admin/webhook/user", {
      params,
    });
    return response.data;
  },

  /**
   * GET /admin/webhook/:id - Get webhook by ID
   */
  getById: async (id: string): Promise<Webhook> => {
    const response = await apiClient.get<Webhook>(`/admin/webhook/${id}`);
    return response.data;
  },

  /**
   * POST /admin/webhook/create - Create webhook
   *
   * A secret is automatically generated for signature verification.
   */
  create: async (data: CreateWebhookRequest): Promise<Webhook> => {
    const response = await apiClient.post<Webhook, CreateWebhookRequest>(
      "/admin/webhook/create",
      data,
    );
    return response.data;
  },

  /**
   * PATCH /admin/webhook/:id - Update webhook
   */
  update: async (id: string, data: UpdateWebhookRequest): Promise<Webhook> => {
    const response = await apiClient.patch<Webhook, UpdateWebhookRequest>(
      `/admin/webhook/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * PATCH /admin/webhook/:id/toggle - Toggle webhook active status
   */
  toggle: async (id: string): Promise<Webhook> => {
    const response = await apiClient.patch<Webhook, undefined>(
      `/admin/webhook/${id}/toggle`,
      undefined,
    );
    return response.data;
  },

  /**
   * DELETE /admin/webhook/:id - Delete webhook
   *
   * Also deletes all associated webhook logs.
   */
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(
      `/admin/webhook/${id}`,
    );
    return response.data;
  },
};
