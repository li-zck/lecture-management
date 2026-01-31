import { apiClient } from "./client";

/**
 * Enrollment Session interface
 * Represents a time period when students can enroll in courses
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
	} | null;
	startDate: string;
	endDate: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

/**
 * Public Enrollment Session API
 * Endpoints for students/lecturers to view active enrollment sessions
 * All endpoints require authentication
 */
export const enrollmentSessionApi = {
	/**
	 * GET /enrollment/session/all - Get all active enrollment sessions
	 */
	getAllActive: async (): Promise<EnrollmentSession[]> => {
		const response = await apiClient.get<EnrollmentSession[]>(
			"/enrollment/session/all",
		);
		return response.data;
	},

	/**
	 * GET /enrollment/session/:id - Get active session by ID
	 */
	getActiveById: async (id: string): Promise<EnrollmentSession> => {
		const response = await apiClient.get<EnrollmentSession>(
			`/enrollment/session/${id}`,
		);
		return response.data;
	},

	/**
	 * GET /enrollment/session/semester/:semesterId - Get active sessions by semester
	 */
	getActiveBySemester: async (
		semesterId: string,
	): Promise<EnrollmentSession[]> => {
		const response = await apiClient.get<EnrollmentSession[]>(
			`/enrollment/session/semester/${semesterId}`,
		);
		return response.data;
	},
};
