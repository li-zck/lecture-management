import { apiClient } from "./client";

/**
 * Course on Semester interface
 * Represents a course offering in a specific semester
 */
export interface CourseSemester {
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
	createdAt: string;
	updatedAt: string;
	course?: {
		id: string;
		name: string;
		description: string | null;
		credits: number;
		departmentId: string | null;
	} | null;
	semester?: {
		id: string;
		name: string;
		startDate: string;
		endDate: string;
	} | null;
	lecturer?: {
		id: string;
		fullName: string | null;
		lecturerId: string;
	} | null;
}

/**
 * Query parameters for course-semester endpoints
 */
export interface CourseSemesterQueryParams {
	includeCourses?: boolean;
	includeSemesters?: boolean;
	courseId?: string;
	semesterId?: string;
}

/**
 * Public Course-Semester API
 * Endpoints require authentication
 */
export const courseSemesterApi = {
	/**
	 * GET /course-semester/all - Get all course-semesters
	 */
	getAll: async (
		params?: CourseSemesterQueryParams,
	): Promise<CourseSemester[]> => {
		const response = await apiClient.get<CourseSemester[]>(
			"/course-semester/all",
			{
				params: {
					includeCourses: params?.includeCourses,
					includeSemesters: params?.includeSemesters,
					courseId: params?.courseId,
					semesterId: params?.semesterId,
				},
			},
		);
		return response.data;
	},

	/**
	 * GET /course-semester/find/:id - Get course-semester by ID
	 */
	getById: async (
		id: string,
		params?: Omit<CourseSemesterQueryParams, "courseId" | "semesterId">,
	): Promise<CourseSemester> => {
		const response = await apiClient.get<CourseSemester>(
			`/course-semester/find/${id}`,
			{
				params: {
					includeCourses: params?.includeCourses,
					includeSemesters: params?.includeSemesters,
				},
			},
		);
		return response.data;
	},
};
