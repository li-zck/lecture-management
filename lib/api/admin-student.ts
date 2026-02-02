import { apiClient } from "./client";

/**
 * Student interface for admin operations
 */
export interface StudentAdmin {
	id: string;
	email: string;
	username: string;
	studentId: string | null;
	fullName: string | null;
	gender: boolean | null;
	birthDate: string | null;
	citizenId: string | null;
	phone: string | null;
	address: string | null;
	avatar: string | null;
	active: boolean;
	departmentId: string | null;
	department?: {
		id: string;
		name: string;
	};
	createdAt: string;
	updatedAt: string;
}

/**
 * Create student request DTO
 */
export interface CreateStudentRequest {
	email: string;
	username: string;
	password: string;
	studentId?: string;
	fullName?: string;
	gender?: boolean;
	birthDate?: string;
	citizenId?: string;
	phone?: string;
	address?: string;
	departmentId?: string;
}

/**
 * Update student request DTO
 */
export interface UpdateStudentRequest {
	email?: string;
	username?: string;
	newPassword?: string;
	confirmPassword?: string;
	studentId?: string;
	fullName?: string;
	gender?: boolean;
	birthDate?: string;
	citizenId?: string;
	phone?: string;
	address?: string;
	active?: boolean;
	departmentId?: string | null;
}

/**
 * Student search parameters
 */
export interface StudentSearchParams extends Record<string, unknown> {
	email?: string;
	studentId?: string;
	username?: string;
	citizenId?: string;
	phone?: string;
}

/**
 * Admin Student Management API
 * All endpoints require admin authentication
 */
export const adminStudentApi = {
	/**
	 * GET /admin/student/all - Get all students
	 */
	getAll: async (): Promise<StudentAdmin[]> => {
		const response = await apiClient.get<StudentAdmin[]>("/admin/student/all");
		return response.data;
	},

	/**
	 * GET /admin/student/find/:id - Get student by ID
	 */
	getById: async (id: string): Promise<StudentAdmin> => {
		const response = await apiClient.get<StudentAdmin>(
			`/admin/student/find/${id}`,
		);
		return response.data;
	},

	/**
	 * GET /admin/student/find - Find students by email/studentId/username/citizenId/phone
	 */
	search: async (params: StudentSearchParams): Promise<StudentAdmin[]> => {
		const response = await apiClient.get<StudentAdmin[]>(
			"/admin/student/find",
			{
				params,
			},
		);
		return response.data;
	},

	/**
	 * POST /admin/student/create - Create single student
	 */
	create: async (data: CreateStudentRequest): Promise<StudentAdmin> => {
		const response = await apiClient.post<StudentAdmin, CreateStudentRequest>(
			"/admin/student/create",
			data,
		);
		return response.data;
	},

	/**
	 * POST /admin/student/create/multiple - Create multiple students
	 */
	createMultiple: async (
		data: CreateStudentRequest[],
	): Promise<{ created: number; students: StudentAdmin[] }> => {
		const response = await apiClient.post<
			{ created: number; students: StudentAdmin[] },
			CreateStudentRequest[]
		>("/admin/student/create/multiple", data);
		return response.data;
	},

	/**
	 * PATCH /admin/student/update/:id - Update student
	 */
	update: async (
		id: string,
		data: UpdateStudentRequest,
	): Promise<StudentAdmin> => {
		const response = await apiClient.patch<StudentAdmin, UpdateStudentRequest>(
			`/admin/student/update/${id}`,
			data,
		);
		return response.data;
	},

	/**
	 * DELETE /admin/student/delete/:id - Delete single student
	 */
	delete: async (id: string): Promise<{ message: string }> => {
		const response = await apiClient.delete<{ message: string }>(
			`/admin/student/delete/${id}`,
		);
		return response.data;
	},

	/**
	 * DELETE /admin/student/delete - Delete multiple students
	 */
	deleteMultiple: async (
		ids: string[],
	): Promise<{ message: string; deleted: number }> => {
		const response = await apiClient.delete<
			{ message: string; deleted: number },
			{ ids: string[] }
		>("/admin/student/delete", { ids });
		return response.data;
	},
};
