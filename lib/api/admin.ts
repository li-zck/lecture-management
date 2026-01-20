import { apiClient } from "./client";

/**
 * Admin user interface
 */
export interface Admin {
    id: string;
    email: string;
    username: string;
    fullName: string | null;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Create admin request DTO
 */
export interface CreateAdminRequest {
    email: string;
    username: string;
    password: string;
    fullName?: string;
}

/**
 * Update admin request DTO
 */
export interface UpdateAdminRequest {
    email?: string;
    username?: string;
    password?: string;
    fullName?: string;
    active?: boolean;
}

/**
 * Admin API methods
 * All endpoints require admin authentication
 */
export const adminApi = {
    /**
     * GET /admin/all - Get all admin users
     */
    getAll: async (): Promise<Admin[]> => {
        const response = await apiClient.get<Admin[]>("/admin/all");
        return response.data;
    },

    /**
     * GET /admin/find/:id - Get admin user by ID
     */
    getById: async (id: string): Promise<Admin> => {
        const response = await apiClient.get<Admin>(`/admin/find/${id}`);
        return response.data;
    },

    /**
     * POST /admin/create - Create new admin user
     */
    create: async (data: CreateAdminRequest): Promise<Admin> => {
        const response = await apiClient.post<Admin, CreateAdminRequest>(
            "/admin/create",
            data
        );
        return response.data;
    },

    /**
     * PATCH /admin/update/:id - Update admin user
     */
    update: async (id: string, data: UpdateAdminRequest): Promise<Admin> => {
        const response = await apiClient.patch<Admin, UpdateAdminRequest>(
            `/admin/update/${id}`,
            data
        );
        return response.data;
    },

    /**
     * DELETE /admin/delete/:id - Delete admin user
     */
    delete: async (id: string): Promise<{ message: string }> => {
        const response = await apiClient.delete<{ message: string }>(
            `/admin/delete/${id}`
        );
        return response.data;
    },
};
