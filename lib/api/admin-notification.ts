import { apiClient } from "./client";

/**
 * Notification type enum
 */
export type NotificationType = "INFO" | "WARNING" | "ALERT";

/**
 * Notification interface
 */
export interface Notification {
	id: string;
	title: string;
	message: string;
	url: string | null;
	type: NotificationType;
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
	isRead: boolean;
	createdAt: string;
	updatedAt: string;
}

/**
 * Create notification request DTO
 */
export interface CreateNotificationRequest {
	title: string;
	message: string;
	url?: string;
	type?: NotificationType;
	studentId?: string;
	lecturerId?: string;
}

/**
 * Update notification request DTO
 */
export interface UpdateNotificationRequest {
	title?: string;
	message?: string;
	type?: NotificationType;
	isRead?: boolean;
	studentId?: string;
	lecturerId?: string;
}

/**
 * Query parameters for fetching notifications by user
 */
export interface NotificationUserQuery {
	lecturerId?: string;
	studentId?: string;
}

/**
 * Admin Notification Management API
 * All endpoints require admin authentication
 */
export const adminNotificationApi = {
	/**
	 * GET /admin/notification/all - Get all notifications
	 */
	getAll: async (): Promise<Notification[]> => {
		const response = await apiClient.get<Notification[]>(
			"/admin/notification/all",
		);
		return response.data;
	},

	/**
	 * GET /admin/notification/user - Get notifications by user (lecturerId or studentId)
	 */
	getByUser: async (params: NotificationUserQuery): Promise<Notification[]> => {
		const response = await apiClient.get<Notification[]>(
			"/admin/notification/user",
			{ params },
		);
		return response.data;
	},

	/**
	 * GET /admin/notification/:id - Get notification by ID
	 */
	getById: async (id: string): Promise<Notification> => {
		const response = await apiClient.get<Notification>(
			`/admin/notification/${id}`,
		);
		return response.data;
	},

	/**
	 * POST /admin/notification/create - Create notification
	 */
	create: async (data: CreateNotificationRequest): Promise<Notification> => {
		const response = await apiClient.post<
			Notification,
			CreateNotificationRequest
		>("/admin/notification/create", data);
		return response.data;
	},

	/**
	 * PATCH /admin/notification/:id - Update notification
	 */
	update: async (
		id: string,
		data: UpdateNotificationRequest,
	): Promise<Notification> => {
		const response = await apiClient.patch<
			Notification,
			UpdateNotificationRequest
		>(`/admin/notification/${id}`, data);
		return response.data;
	},

	/**
	 * DELETE /admin/notification/:id - Delete notification
	 */
	delete: async (id: string): Promise<{ message: string }> => {
		const response = await apiClient.delete<{ message: string }>(
			`/admin/notification/${id}`,
		);
		return response.data;
	},
};
