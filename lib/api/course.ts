import { apiClient } from "./client";

export interface Course {
  id: string;
  name: string;
  credits: number;
  departmentId: string;
  department?: {
    id: string;
    name: string;
  } | null;
}

export const courseApi = {
  /**
   * Get all courses
   * Uses GET /course/all endpoint
   */
  getAll: async (
    { includeDepartment } = {
      includeDepartment: true,
    },
  ): Promise<Course[]> => {
    const response = await apiClient.get<Course[]>("/course/all", {
      params: { includeDepartment },
    });
    return response.data;
  },

  /**
   * Get courses by department
   * Uses GET /course/department/:departmentId endpoint
   */
  getByDepartment: async (
    departmentId: string,
    includeDepartment = true,
  ): Promise<Course[]> => {
    const response = await apiClient.get<Course[]>(
      `/course/department/${departmentId}`,
      {
        params: { includeDepartment },
      },
    );
    return response.data;
  },

  /**
   * Get a single course by ID
   * Uses GET /course/find/:id endpoint
   */
  getById: async (id: string, includeDepartment = true): Promise<Course> => {
    const response = await apiClient.get<Course>(`/course/find/${id}`, {
      params: { includeDepartment },
    });
    return response.data;
  },
};
