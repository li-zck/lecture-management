import { apiClient } from "./client";

/**
 * Department interface for public API
 */
export interface Department {
	id: string;
	departmentId: string;
	name: string;
	description?: string;
	headId?: string;
	head?: {
		id: string;
		fullName: string;
	};
	createdAt?: string;
	updatedAt?: string;
}

/**
 * Public Department API
 * For authenticated users (any role) to read department data
 */
export const departmentApi = {
	/**
	 * GET /department/all - Get all departments
	 */
	getAll: async (): Promise<Department[]> => {
		const response = await apiClient.get<Department[]>("/department/all");
		return response.data;
	},

	/**
	 * GET /department/find/:id - Get department by ID
	 */
	getById: async (id: string): Promise<Department> => {
		const response = await apiClient.get<Department>(`/department/find/${id}`);
		return response.data;
	},
};
