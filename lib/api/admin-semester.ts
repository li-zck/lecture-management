import { apiClient } from "./client";

/**
 * Semester interface
 */
export interface Semester {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Create semester request DTO
 */
export interface CreateSemesterRequest {
    name: string;
    startDate: string;
    endDate: string;
}

/**
 * Update semester request DTO
 */
export interface UpdateSemesterRequest {
    name?: string;
    startDate?: string;
    endDate?: string;
}

/**
 * Admin Semester Management API
 * All endpoints require admin authentication
 */
export const adminSemesterApi = {
    /**
     * GET /admin/semester/all - Get all semesters
     */
    getAll: async (): Promise<Semester[]> => {
        const response = await apiClient.get<Semester[]>("/admin/semester/all");
        return response.data;
    },

    /**
     * GET /admin/semester/find/:id - Get semester by ID
     */
    getById: async (id: string): Promise<Semester> => {
        const response = await apiClient.get<Semester>(
            `/admin/semester/find/${id}`
        );
        return response.data;
    },

    /**
     * POST /admin/semester/create - Create semester
     */
    create: async (data: CreateSemesterRequest): Promise<Semester> => {
        const response = await apiClient.post<Semester, CreateSemesterRequest>(
            "/admin/semester/create",
            data
        );
        return response.data;
    },

    /**
     * PATCH /admin/semester/update/:id - Update semester
     */
    update: async (
        id: string,
        data: UpdateSemesterRequest
    ): Promise<Semester> => {
        const response = await apiClient.patch<Semester, UpdateSemesterRequest>(
            `/admin/semester/update/${id}`,
            data
        );
        return response.data;
    },

    /**
     * DELETE /admin/semester/delete/:id - Delete single semester
     */
    delete: async (id: string): Promise<{ message: string }> => {
        const response = await apiClient.delete<{ message: string }>(
            `/admin/semester/delete/${id}`
        );
        return response.data;
    },

    /**
     * DELETE /admin/semester/delete - Delete multiple semesters
     */
    deleteMultiple: async (
        ids: string[]
    ): Promise<{ message: string; deleted: number }> => {
        const response = await apiClient.delete<
            { message: string; deleted: number },
            { ids: string[] }
        >("/admin/semester/delete", { ids });
        return response.data;
    },
};
