import { apiClient } from "./client";

/**
 * Course-Semester relationship interface
 */
export interface CourseSemester {
  id: string;
  courseId: string;
  semesterId: string;
  lecturerId: string | null;
  dayOfWeek: number | null;
  startTime: number | null;
  endTime: number | null;
  location: string | null;
  capacity: number | null;
  course?: {
    id: string;
    name: string;
    credits: number;
  };
  semester?: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
  };
  lecturer?: {
    id: string;
    fullName: string | null;
    lecturerId: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Create course-semester request DTO
 */
export interface CreateCourseSemesterRequest {
  courseId: string;
  semesterId: string;
  lecturerId?: string;
  dayOfWeek?: number;
  startTime?: number;
  endTime?: number;
  location?: string;
  capacity?: number;
}

/**
 * Update course-semester request DTO
 */
export interface UpdateCourseSemesterRequest {
  lecturerId?: string | null;
  dayOfWeek?: number | null;
  startTime?: number | null;
  endTime?: number | null;
  location?: string | null;
  capacity?: number | null;
}

/**
 * Admin Course-Semester Management API
 * All endpoints require admin authentication
 */
export const adminCourseSemesterApi = {
  /**
   * GET /admin/semester/course/all - Get all course-semester relationships
   */
  getAll: async (): Promise<CourseSemester[]> => {
    const response = await apiClient.get<CourseSemester[]>(
      "/admin/semester/course/all",
      {
        params: {
          includeCourses: true,
          includeSemesters: true,
          includeLecturer: true,
        },
      },
    );
    return response.data;
  },

  /**
   * GET /admin/semester/course/find/:id - Get course-semester by ID
   */
  getById: async (id: string): Promise<CourseSemester> => {
    const response = await apiClient.get<CourseSemester>(
      `/admin/semester/course/find/${id}`,
    );
    return response.data;
  },

  /**
   * POST /admin/semester/course/create - Create course-semester relationship
   */
  create: async (
    data: CreateCourseSemesterRequest,
  ): Promise<CourseSemester> => {
    const response = await apiClient.post<
      CourseSemester,
      CreateCourseSemesterRequest
    >("/admin/semester/course/create", data);
    return response.data;
  },

  /**
   * PUT /admin/semester/course/update/:id - Update course-semester relationship
   */
  update: async (
    id: string,
    data: UpdateCourseSemesterRequest,
  ): Promise<CourseSemester> => {
    const response = await apiClient.put<
      CourseSemester,
      UpdateCourseSemesterRequest
    >(`/admin/semester/course/update/${id}`, data);
    return response.data;
  },

  /**
   * DELETE /admin/semester/course/delete/:id - Delete single course-semester
   */
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(
      `/admin/semester/course/delete/${id}`,
    );
    return response.data;
  },

  /**
   * DELETE /admin/semester/course/delete - Delete multiple course-semesters
   */
  deleteMultiple: async (
    ids: string[],
  ): Promise<{ message: string; deleted: number }> => {
    const response = await apiClient.delete<
      { message: string; deleted: number },
      { ids: string[] }
    >("/admin/semester/course/delete", { ids });
    return response.data;
  },
};
