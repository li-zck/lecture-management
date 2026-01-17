import { apiClient } from "./client";

/**
 * Department interface
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
    createdAt: string;
    updatedAt: string;
}

/**
 * Create department request DTO
 */
export interface CreateDepartmentRequest {
    departmentId: string;
    name: string;
    description?: string;
    headId?: string;
}

/**
 * Update department request DTO
 */
export interface UpdateDepartmentRequest {
    departmentId?: string;
    name?: string;
    description?: string;
    headId?: string | null;
}

/**
 * Admin Department Management API
 * All endpoints require admin authentication
 */
export const adminDepartmentApi = {
    /**
     * GET /admin/department/all - Get all departments
     */
    getAll: async (): Promise<Department[]> => {
        const response = await apiClient.get<Department[]>("/admin/department/all");
        return response.data;
    },

    /**
     * GET /admin/department/find/:id - Get department by ID
     */
    getById: async (id: string): Promise<Department> => {
        const response = await apiClient.get<Department>(
            `/admin/department/find/${id}`
        );
        return response.data;
    },

    /**
     * POST /admin/department/create - Create single department
     */
    create: async (data: CreateDepartmentRequest): Promise<Department> => {
        const response = await apiClient.post<Department, CreateDepartmentRequest>(
            "/admin/department/create",
            data
        );
        return response.data;
    },

    /**
     * POST /admin/department/create/multiple - Create multiple departments
     */
    createMultiple: async (
        data: CreateDepartmentRequest[]
    ): Promise<{ created: number; departments: Department[] }> => {
        const response = await apiClient.post<
            { created: number; departments: Department[] },
            CreateDepartmentRequest[]
        >("/admin/department/create/multiple", data);
        return response.data;
    },

    /**
     * PATCH /admin/department/update/:id - Update department
     */
    update: async (
        id: string,
        data: UpdateDepartmentRequest
    ): Promise<Department> => {
        const response = await apiClient.patch<Department, UpdateDepartmentRequest>(
            `/admin/department/update/${id}`,
            data
        );
        return response.data;
    },

    /**
     * DELETE /admin/department/delete/:id - Delete single department
     */
    delete: async (id: string): Promise<{ message: string }> => {
        const response = await apiClient.delete<{ message: string }>(
            `/admin/department/delete/${id}`
        );
        return response.data;
    },

    /**
     * DELETE /admin/department/delete - Delete multiple departments
     */
    deleteMultiple: async (
        ids: string[]
    ): Promise<{ message: string; deleted: number }> => {
        const response = await apiClient.delete<
            { message: string; deleted: number },
            { ids: string[] }
        >("/admin/department/delete", { ids });
        return response.data;
    },
};
