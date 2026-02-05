import { apiClient } from "./client";

/**
 * Public Student interface (excludes sensitive fields like password)
 */
export interface PublicStudent {
  id: string;
  email: string;
  username: string;
  studentId: string | null;
  fullName: string | null;
  gender: boolean | null;
  birthDate: string | null;
  phone: string | null;
  address: string | null;
  avatar: string | null;
  active: boolean;
  departmentId: string;
  department?: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Public Student API
 * Public endpoints for fetching student information
 */
export const publicStudentApi = {
  /**
   * GET /student/all - Get all students (public list)
   */
  getAll: async (): Promise<PublicStudent[]> => {
    const response = await apiClient.get<PublicStudent[]>("/student/all");
    return response.data;
  },

  /**
   * GET /student/:id - Get student by ID
   */
  getById: async (id: string): Promise<PublicStudent> => {
    const response = await apiClient.get<PublicStudent>(`/student/${id}`);
    return response.data;
  },
};
