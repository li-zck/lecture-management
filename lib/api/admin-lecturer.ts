import { apiClient } from "./client";

/**
 * Lecturer interface for admin operations
 */
export interface LecturerAdmin {
	id: string;
	email: string;
	username: string;
	lecturerId: string;
	fullName: string | null;
	active: boolean;
	departmentHeadId: string | null;
	departmentHead?: {
		id: string;
		name: string;
	};
	createdAt: string;
	updatedAt: string;
}

/**
 * Create lecturer request DTO
 */
export interface CreateLecturerRequest {
	email: string;
	username: string;
	password: string;
	lecturerId: string;
	fullName?: string;
	departmentHeadId?: string;
}

/**
 * Update lecturer request DTO
 */
export interface UpdateLecturerRequest {
	email?: string;
	username?: string;
	password?: string;
	lecturerId?: string;
	fullName?: string;
	active?: boolean;
	departmentHeadId?: string | null;
}

/**
 * Admin Lecturer Management API
 * All endpoints require admin authentication
 */
export const adminLecturerApi = {
	/**
	 * GET /admin/lecturer/all - Get all lecturers
	 */
	getAll: async (): Promise<LecturerAdmin[]> => {
		const response = await apiClient.get<LecturerAdmin[]>(
			"/admin/lecturer/all",
		);
		return response.data;
	},

	/**
	 * GET /admin/lecturer/find/:id - Get lecturer by ID
	 */
	getById: async (id: string): Promise<LecturerAdmin> => {
		const response = await apiClient.get<LecturerAdmin>(
			`/admin/lecturer/find/${id}`,
		);
		return response.data;
	},

	/**
	 * POST /admin/lecturer/create - Create single lecturer
	 */
	create: async (data: CreateLecturerRequest): Promise<LecturerAdmin> => {
		const response = await apiClient.post<LecturerAdmin, CreateLecturerRequest>(
			"/admin/lecturer/create",
			data,
		);
		return response.data;
	},

	/**
	 * POST /admin/lecturer/create/multiple - Create multiple lecturers
	 */
	createMultiple: async (
		data: CreateLecturerRequest[],
	): Promise<{ created: number; lecturers: LecturerAdmin[] }> => {
		const response = await apiClient.post<
			{ created: number; lecturers: LecturerAdmin[] },
			CreateLecturerRequest[]
		>("/admin/lecturer/create/multiple", data);
		return response.data;
	},

	/**
	 * PATCH /admin/lecturer/update/:id - Update lecturer
	 */
	update: async (
		id: string,
		data: UpdateLecturerRequest,
	): Promise<LecturerAdmin> => {
		const response = await apiClient.patch<
			LecturerAdmin,
			UpdateLecturerRequest
		>(`/admin/lecturer/update/${id}`, data);
		return response.data;
	},

	/**
	 * DELETE /admin/lecturer/delete/:id - Delete single lecturer
	 */
	delete: async (id: string): Promise<{ message: string }> => {
		const response = await apiClient.delete<{ message: string }>(
			`/admin/lecturer/delete/${id}`,
		);
		return response.data;
	},

	/**
	 * DELETE /admin/lecturer/delete - Delete multiple lecturers
	 */
	deleteMultiple: async (
		ids: string[],
	): Promise<{ message: string; deleted: number }> => {
		const response = await apiClient.delete<
			{ message: string; deleted: number },
			{ ids: string[] }
		>("/admin/lecturer/delete", { ids });
		return response.data;
	},
};
