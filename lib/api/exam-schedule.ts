import { apiClient } from "./client";

/**
 * Public Exam Schedule interface
 */
export interface PublicExamSchedule {
  id: string;
  courseOnSemesterId: string;
  examDate: string | null;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  courseOnSemester?: {
    id: string;
    course?: {
      id: string;
      name: string;
      credits: number;
    };
    semester?: {
      id: string;
      name: string;
    };
    lecturer?: {
      id: string;
      fullName: string | null;
      lecturerId: string;
    };
  } | null;
}

/**
 * Create exam schedule request DTO (for lecturers)
 */
export interface CreateExamScheduleRequest {
  courseOnSemesterId: string;
  examDate?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
}

/**
 * Update exam schedule request DTO (for lecturers)
 */
export interface UpdateExamScheduleRequest {
  courseOnSemesterId?: string;
  examDate?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
}

/**
 * Public Exam Schedule API
 * Endpoints for viewing exam schedules (require authentication)
 */
export const examScheduleApi = {
  /**
   * GET /exam-schedule/all - Get all exam schedules
   */
  getAll: async (): Promise<PublicExamSchedule[]> => {
    const response =
      await apiClient.get<PublicExamSchedule[]>("/exam-schedule/all");
    return response.data;
  },

  /**
   * GET /exam-schedule/find/:id - Get exam schedule by ID
   */
  getById: async (id: string): Promise<PublicExamSchedule> => {
    const response = await apiClient.get<PublicExamSchedule>(
      `/exam-schedule/find/${id}`,
    );
    return response.data;
  },
};

/**
 * Student Exam Schedule API
 * Endpoints for students to view their exam schedules
 */
export const studentExamScheduleApi = {
  /**
   * GET /exam-schedule/student/my-schedules - Get own exam schedules
   */
  getMySchedules: async (
    semesterId?: string,
  ): Promise<PublicExamSchedule[]> => {
    const response = await apiClient.get<PublicExamSchedule[]>(
      "/exam-schedule/student/my-schedules",
      {
        params: semesterId ? { semesterId } : undefined,
      },
    );
    return response.data;
  },
};

/**
 * Lecturer Exam Schedule API
 * Endpoints for lecturers to manage exam schedules for their courses
 */
export const lecturerExamScheduleApi = {
  /**
   * GET /exam-schedule/lecturer/my-courses - Get exam schedules for own courses
   */
  getMyCourseSchedules: async (): Promise<PublicExamSchedule[]> => {
    const response = await apiClient.get<PublicExamSchedule[]>(
      "/exam-schedule/lecturer/my-courses",
    );
    return response.data;
  },

  /**
   * POST /exam-schedule/lecturer/create - Create exam schedule
   */
  create: async (
    data: CreateExamScheduleRequest,
  ): Promise<PublicExamSchedule> => {
    const response = await apiClient.post<
      PublicExamSchedule,
      CreateExamScheduleRequest
    >("/exam-schedule/lecturer/create", data);
    return response.data;
  },

  /**
   * PATCH /exam-schedule/lecturer/:id - Update exam schedule
   */
  update: async (
    id: string,
    data: UpdateExamScheduleRequest,
  ): Promise<PublicExamSchedule> => {
    const response = await apiClient.patch<
      PublicExamSchedule,
      UpdateExamScheduleRequest
    >(`/exam-schedule/lecturer/${id}`, data);
    return response.data;
  },

  /**
   * DELETE /exam-schedule/lecturer/:id - Delete exam schedule
   */
  delete: async (id: string): Promise<{ count: number }> => {
    const response = await apiClient.delete<{ count: number }>(
      `/exam-schedule/lecturer/${id}`,
    );
    return response.data;
  },
};
