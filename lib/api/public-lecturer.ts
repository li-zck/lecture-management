import { apiClient } from "./client";

/**
 * Public Lecturer interface (excludes sensitive fields like password)
 */
export interface PublicLecturer {
	id: string;
	email: string;
	username: string;
	lecturerId: string;
	fullName: string | null;
	active: boolean;
	createdAt: string;
	updatedAt: string;
}

/**
 * Public Lecturer API
 * Public endpoints for fetching lecturer information
 */
export const publicLecturerApi = {
	/**
	 * GET /lecturer/all - Get all lecturers (public list)
	 */
	getAll: async (): Promise<PublicLecturer[]> => {
		const response = await apiClient.get<PublicLecturer[]>("/lecturer/all");
		return response.data;
	},

	/**
	 * GET /lecturer/:id - Get lecturer by ID
	 */
	getById: async (id: string): Promise<PublicLecturer> => {
		const response = await apiClient.get<PublicLecturer>(`/lecturer/${id}`);
		return response.data;
	},
};
