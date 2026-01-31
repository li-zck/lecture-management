import { apiClient } from "./client";

/**
 * Enrollment Session interface
 */
export interface EnrollmentSession {
	id: string;
	name: string | null;
	semesterId: string;
	semester?: {
		id: string;
		name: string;
		startDate: string;
		endDate: string;
	};
	startDate: string;
	endDate: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

/**
 * Create enrollment session request DTO
 */
export interface CreateEnrollmentSessionRequest {
	name?: string;
	semesterId: string;
	startDate: string;
	endDate: string;
	isActive?: boolean;
}

/**
 * Update enrollment session request DTO
 */
export interface UpdateEnrollmentSessionRequest {
	name?: string;
	semesterId?: string;
	startDate?: string;
	endDate?: string;
	isActive?: boolean;
}

/**
 * Admin Enrollment Session Management API
 * All endpoints require admin authentication
 */
export const adminEnrollmentSessionApi = {
	/**
	 * GET /admin/enrollment/session/all - Get all enrollment sessions
	 */
	getAll: async (): Promise<EnrollmentSession[]> => {
		const response = await apiClient.get<EnrollmentSession[]>(
			"/admin/enrollment/session/all",
		);
		return response.data;
	},

	/**
	 * GET /admin/enrollment/session/:id - Get enrollment session by ID
	 */
	getById: async (id: string): Promise<EnrollmentSession> => {
		const response = await apiClient.get<EnrollmentSession>(
			`/admin/enrollment/session/${id}`,
		);
		return response.data;
	},

	/**
	 * GET /admin/enrollment/session/semester/:semesterId - Get sessions by semester
	 */
	getBySemester: async (semesterId: string): Promise<EnrollmentSession[]> => {
		const response = await apiClient.get<EnrollmentSession[]>(
			`/admin/enrollment/session/semester/${semesterId}`,
		);
		return response.data;
	},

	/**
	 * POST /admin/enrollment/session/create - Create enrollment session
	 */
	create: async (
		data: CreateEnrollmentSessionRequest,
	): Promise<EnrollmentSession> => {
		const response = await apiClient.post<
			EnrollmentSession,
			CreateEnrollmentSessionRequest
		>("/admin/enrollment/session/create", data);
		return response.data;
	},

	/**
	 * POST /admin/enrollment/session/create-multiple - Create multiple enrollment sessions
	 */
	createMultiple: async (
		sessions: CreateEnrollmentSessionRequest[],
	): Promise<{ created: number; sessions: EnrollmentSession[] }> => {
		const response = await apiClient.post<
			{ created: number; sessions: EnrollmentSession[] },
			{ sessions: CreateEnrollmentSessionRequest[] }
		>("/admin/enrollment/session/create-multiple", { sessions });
		return response.data;
	},

	/**
	 * PATCH /admin/enrollment/session/update/:id - Update enrollment session
	 */
	update: async (
		id: string,
		data: UpdateEnrollmentSessionRequest,
	): Promise<EnrollmentSession> => {
		const response = await apiClient.patch<
			EnrollmentSession,
			UpdateEnrollmentSessionRequest
		>(`/admin/enrollment/session/update/${id}`, data);
		return response.data;
	},

	/**
	 * DELETE /admin/enrollment/session/delete/:id - Delete single enrollment session
	 */
	delete: async (id: string): Promise<{ message: string }> => {
		const response = await apiClient.delete<{ message: string }>(
			`/admin/enrollment/session/delete/${id}`,
		);
		return response.data;
	},

	/**
	 * DELETE /admin/enrollment/session/delete-multiple - Delete multiple enrollment sessions
	 */
	deleteMultiple: async (
		ids: string[],
	): Promise<{ message: string; deleted: number }> => {
		const response = await apiClient.delete<
			{ message: string; deleted: number },
			{ ids: string[] }
		>("/admin/enrollment/session/delete-multiple", { ids });
		return response.data;
	},
};
