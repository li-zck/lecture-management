import { apiClient } from "./client";
// Use admin Semester type and extend it locally
import type { Semester as AdminSemester } from "./admin-semester";

/**
 * Semester with course offerings (extended)
 */
export interface Semester extends AdminSemester {
	courseOnSemesters?: CourseOnSemesterBasic[];
}

/**
 * Basic Course on Semester (used in includes)
 */
export interface CourseOnSemesterBasic {
	id: string;
	courseId: string;
	semesterId: string;
	lecturerId: string | null;
	location: string | null;
	dayOfWeek: number | null;
	startTime: number | null;
	endTime: number | null;
	capacity: number | null;
	isSummarized: boolean;
}

/**
 * Query parameters for semester endpoints
 */
export interface SemesterQueryParams {
	includeCourses?: boolean;
	includeDocuments?: boolean;
}

/**
 * Public Semester API
 * Endpoints require authentication
 */
export const semesterApi = {
	/**
	 * GET /semester/all - Get all semesters
	 */
	getAll: async (params?: SemesterQueryParams): Promise<Semester[]> => {
		const response = await apiClient.get<Semester[]>("/semester/all", {
			params: {
				includeCourses: params?.includeCourses,
				includeDocuments: params?.includeDocuments,
			},
		});
		return response.data;
	},

	/**
	 * GET /semester/find/:id - Get semester by ID
	 */
	getById: async (
		id: string,
		params?: SemesterQueryParams,
	): Promise<Semester> => {
		const response = await apiClient.get<Semester>(`/semester/find/${id}`, {
			params: {
				includeCourses: params?.includeCourses,
				includeDocuments: params?.includeDocuments,
			},
		});
		return response.data;
	},
};
