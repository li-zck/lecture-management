import { apiClient } from "./client";

/**
 * Course interface
 */
export interface Course {
    id: string;
    name: string;
    credits: number;
    departmentId: string | null;
    semester: string;
    description?: string;
    department?: {
        id: string;
        name: string;
    };
    attachments?: CourseAttachment[];
    createdAt: string;
    updatedAt: string;
}

/**
 * Course attachment interface
 */
export interface CourseAttachment {
    id: string;
    title: string;
    path: string;
    url: string;
    createdAt: string;
    updatedAt?: string;
}

/**
 * Create course request DTO
 */
export interface CreateCourseRequest {
    name: string;
    credits: number;
    semester: string;
    departmentId?: string;
    description?: string;
}

/**
 * Update course request DTO
 */
export interface UpdateCourseRequest {
    name?: string;
    credits?: number;
    semester?: string;
    departmentId?: string | null;
    description?: string;
}

/**
 * Course query parameters
 */
export interface CourseQueryParams {
    includeAttachments?: boolean;
    includeDepartment?: boolean;
}

/**
 * Admin Course Management API
 * All endpoints require admin authentication
 */
export const adminCourseApi = {
    /**
     * GET /admin/course/all - Get all courses
     */
    getAll: async (params?: CourseQueryParams): Promise<Course[]> => {
        const response = await apiClient.get<Course[]>("/admin/course/all", {
            params,
        });
        return response.data;
    },

    /**
     * GET /admin/course/find/:id - Get course by ID (with optional attachments/department includes)
     */
    getById: async (id: string, params?: CourseQueryParams): Promise<Course> => {
        const response = await apiClient.get<Course>(`/admin/course/find/${id}`, {
            params,
        });
        return response.data;
    },

    /**
     * GET /admin/course/department/:departmentId - Get courses by department ID
     */
    getByDepartment: async (departmentId: string): Promise<Course[]> => {
        const response = await apiClient.get<Course[]>(
            `/admin/course/department/${departmentId}`
        );
        return response.data;
    },

    /**
     * POST /admin/course/create - Create course (with file uploads)
     * Note: For file uploads, use FormData instead of JSON
     */
    create: async (data: CreateCourseRequest): Promise<Course> => {
        const response = await apiClient.post<Course, CreateCourseRequest>(
            "/admin/course/create",
            data
        );
        return response.data;
    },

    /**
     * PATCH /admin/course/update/:id - Update course (with file uploads)
     * Note: For file uploads, use FormData instead of JSON
     */
    update: async (id: string, data: UpdateCourseRequest): Promise<Course> => {
        const response = await apiClient.patch<Course, UpdateCourseRequest>(
            `/admin/course/update/${id}`,
            data
        );
        return response.data;
    },

    /**
     * DELETE /admin/course/delete/:id - Delete single course
     */
    delete: async (id: string): Promise<{ message: string }> => {
        const response = await apiClient.delete<{ message: string }>(
            `/admin/course/delete/${id}`
        );
        return response.data;
    },

    /**
     * DELETE /admin/course/delete - Delete multiple courses
     */
    deleteMultiple: async (
        ids: string[]
    ): Promise<{ message: string; deleted: number }> => {
        const response = await apiClient.delete<
            { message: string; deleted: number },
            { ids: string[] }
        >("/admin/course/delete", { ids });
        return response.data;
    },
};
