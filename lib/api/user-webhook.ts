import { apiClient } from "./client";

/**
 * User Webhook interface
 */
export interface UserWebhook {
	id: string;
	url: string;
	secret: string | null;
	isActive: boolean;
	studentId: string | null;
	lecturerId: string | null;
	createdAt: string;
	updatedAt: string;
	student?: {
		id: string;
		fullName: string | null;
		studentId: string | null;
	} | null;
	lecturer?: {
		id: string;
		fullName: string | null;
		lecturerId: string;
	} | null;
}

/**
 * Create webhook request DTO (user endpoints)
 */
export interface CreateUserWebhookRequest {
	url: string;
	isActive?: boolean;
}

/**
 * Update webhook request DTO (user endpoints)
 */
export interface UpdateUserWebhookRequest {
	url?: string;
	isActive?: boolean;
}

/**
 * Student Webhook API
 * All endpoints require student authentication
 */
export const studentWebhookApi = {
	/**
	 * GET /webhook/student/all - Get all student webhooks
	 */
	getAll: async (): Promise<UserWebhook[]> => {
		const response = await apiClient.get<UserWebhook[]>("/webhook/student/all");
		return response.data;
	},

	/**
	 * GET /webhook/student/:id - Get webhook by ID
	 */
	getById: async (id: string): Promise<UserWebhook> => {
		const response = await apiClient.get<UserWebhook>(`/webhook/student/${id}`);
		return response.data;
	},

	/**
	 * POST /webhook/student/create - Create webhook
	 */
	create: async (data: CreateUserWebhookRequest): Promise<UserWebhook> => {
		const response = await apiClient.post<
			UserWebhook,
			CreateUserWebhookRequest
		>("/webhook/student/create", data);
		return response.data;
	},

	/**
	 * PATCH /webhook/student/:id - Update webhook
	 */
	update: async (
		id: string,
		data: UpdateUserWebhookRequest,
	): Promise<UserWebhook> => {
		const response = await apiClient.patch<
			UserWebhook,
			UpdateUserWebhookRequest
		>(`/webhook/student/${id}`, data);
		return response.data;
	},

	/**
	 * PATCH /webhook/student/:id/toggle - Toggle webhook active status
	 */
	toggle: async (id: string): Promise<UserWebhook> => {
		const response = await apiClient.patch<UserWebhook, undefined>(
			`/webhook/student/${id}/toggle`,
			undefined,
		);
		return response.data;
	},

	/**
	 * DELETE /webhook/student/:id - Delete webhook
	 */
	delete: async (id: string): Promise<UserWebhook> => {
		const response = await apiClient.delete<UserWebhook>(
			`/webhook/student/${id}`,
		);
		return response.data;
	},
};

/**
 * Lecturer Webhook API
 * All endpoints require lecturer authentication
 */
export const lecturerWebhookApi = {
	/**
	 * GET /webhook/lecturer/all - Get all lecturer webhooks
	 */
	getAll: async (): Promise<UserWebhook[]> => {
		const response = await apiClient.get<UserWebhook[]>(
			"/webhook/lecturer/all",
		);
		return response.data;
	},

	/**
	 * GET /webhook/lecturer/:id - Get webhook by ID
	 */
	getById: async (id: string): Promise<UserWebhook> => {
		const response = await apiClient.get<UserWebhook>(
			`/webhook/lecturer/${id}`,
		);
		return response.data;
	},

	/**
	 * POST /webhook/lecturer/create - Create webhook
	 */
	create: async (data: CreateUserWebhookRequest): Promise<UserWebhook> => {
		const response = await apiClient.post<
			UserWebhook,
			CreateUserWebhookRequest
		>("/webhook/lecturer/create", data);
		return response.data;
	},

	/**
	 * PATCH /webhook/lecturer/:id - Update webhook
	 */
	update: async (
		id: string,
		data: UpdateUserWebhookRequest,
	): Promise<UserWebhook> => {
		const response = await apiClient.patch<
			UserWebhook,
			UpdateUserWebhookRequest
		>(`/webhook/lecturer/${id}`, data);
		return response.data;
	},

	/**
	 * PATCH /webhook/lecturer/:id/toggle - Toggle webhook active status
	 */
	toggle: async (id: string): Promise<UserWebhook> => {
		const response = await apiClient.patch<UserWebhook, undefined>(
			`/webhook/lecturer/${id}/toggle`,
			undefined,
		);
		return response.data;
	},

	/**
	 * DELETE /webhook/lecturer/:id - Delete webhook
	 */
	delete: async (id: string): Promise<UserWebhook> => {
		const response = await apiClient.delete<UserWebhook>(
			`/webhook/lecturer/${id}`,
		);
		return response.data;
	},
};
