import { apiClient } from "./client";

/**
 * Course enrollment interface
 */
export interface Enrollment {
	id: string;
	studentId: string;
	courseOnSemesterId: string;
	gradeType1: number | null;
	gradeType2: number | null;
	gradeType3: number | null;
	finalGrade: number | null;
	student?: {
		id: string;
		studentId: string | null;
		fullName: string | null;
		email: string;
	};
	courseOnSemester?: {
		id: string;
		course: {
			id: string;
			name: string;
			credits: number;
		};
		semester: {
			id: string;
			name: string;
		};
		lecturer?: {
			id: string;
			fullName: string | null;
			lecturerId: string;
		};
	};
	createdAt: string;
	updatedAt: string;
}

/**
 * Create enrollment request DTO
 */
export interface CreateEnrollmentRequest {
	studentId: string;
	courseOnSemesterId: string;
}

/**
 * Update enrollment request DTO
 */
export interface UpdateEnrollmentRequest {
	gradeType1?: number | null;
	gradeType2?: number | null;
	gradeType3?: number | null;
	finalGrade?: number | null;
}

/**
 * Enrollment query parameters
 */
export interface EnrollmentQueryParams {
	includeStudent?: boolean;
	includeCourse?: boolean;
}

/**
 * Admin Course Enrollment Management API
 * All endpoints require admin authentication
 */
export const adminEnrollmentApi = {
	/**
	 * GET /admin/course/enrollment/all - Get all enrollments (with optional includes)
	 */
	getAll: async (params?: EnrollmentQueryParams): Promise<Enrollment[]> => {
		const response = await apiClient.get<Enrollment[]>(
			"/admin/course/enrollment/all",
			{
				params,
			},
		);
		return response.data;
	},

	/**
	 * GET /admin/course/enrollment/find/:id - Get enrollment by ID (with optional includes)
	 */
	getById: async (
		id: string,
		params?: EnrollmentQueryParams,
	): Promise<Enrollment> => {
		const response = await apiClient.get<Enrollment>(
			`/admin/course/enrollment/find/${id}`,
			{
				params,
			},
		);
		return response.data;
	},

	/**
	 * POST /admin/course/enrollment/create - Create course enrollment
	 */
	create: async (data: CreateEnrollmentRequest): Promise<Enrollment> => {
		const response = await apiClient.post<Enrollment, CreateEnrollmentRequest>(
			"/admin/course/enrollment/create",
			data,
		);
		return response.data;
	},

	/**
	 * PATCH /admin/course/enrollment/update/:id - Update course enrollment
	 */
	update: async (
		id: string,
		data: UpdateEnrollmentRequest,
	): Promise<Enrollment> => {
		const response = await apiClient.patch<Enrollment, UpdateEnrollmentRequest>(
			`/admin/course/enrollment/update/${id}`,
			data,
		);
		return response.data;
	},

	/**
	 * DELETE /admin/course/enrollment/delete/:id - Delete single enrollment
	 */
	delete: async (id: string): Promise<{ message: string }> => {
		const response = await apiClient.delete<{ message: string }>(
			`/admin/course/enrollment/delete/${id}`,
		);
		return response.data;
	},

	/**
	 * DELETE /admin/course/enrollment/delete - Delete multiple enrollments
	 */
	deleteMultiple: async (
		ids: string[],
	): Promise<{ message: string; deleted: number }> => {
		const response = await apiClient.delete<
			{ message: string; deleted: number },
			{ ids: string[] }
		>("/admin/course/enrollment/delete", { ids });
		return response.data;
	},
};
