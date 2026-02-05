import { apiClient } from "./client";

/**
 * Exam Schedule interface
 */
export interface ExamSchedule {
  id: string;
  courseOnSemesterId: string;
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
  examDate: string | null;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create exam schedule request DTO
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
 * Update exam schedule request DTO
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
 * Admin Exam Schedule Management API
 * All endpoints require admin authentication
 */
export const adminExamScheduleApi = {
  /**
   * GET /admin/exam-schedule/all - Get all exam schedules
   */
  getAll: async (): Promise<ExamSchedule[]> => {
    const response = await apiClient.get<ExamSchedule[]>(
      "/admin/exam-schedule/all",
    );
    return response.data;
  },

  /**
   * GET /admin/exam-schedule/:id - Get exam schedule by ID
   */
  getById: async (id: string): Promise<ExamSchedule> => {
    const response = await apiClient.get<ExamSchedule>(
      `/admin/exam-schedule/${id}`,
    );
    return response.data;
  },

  /**
   * POST /admin/exam-schedule/create - Create exam schedule
   */
  create: async (data: CreateExamScheduleRequest): Promise<ExamSchedule> => {
    const response = await apiClient.post<
      ExamSchedule,
      CreateExamScheduleRequest
    >("/admin/exam-schedule/create", data);
    return response.data;
  },

  /**
   * POST /admin/exam-schedule/create-multiple - Create multiple exam schedules
   */
  createMultiple: async (
    examSchedules: CreateExamScheduleRequest[],
  ): Promise<{ created: number; examSchedules: ExamSchedule[] }> => {
    const response = await apiClient.post<
      { created: number; examSchedules: ExamSchedule[] },
      { examSchedules: CreateExamScheduleRequest[] }
    >("/admin/exam-schedule/create-multiple", { examSchedules });
    return response.data;
  },

  /**
   * PATCH /admin/exam-schedule/:id - Update exam schedule
   */
  update: async (
    id: string,
    data: UpdateExamScheduleRequest,
  ): Promise<ExamSchedule> => {
    const response = await apiClient.patch<
      ExamSchedule,
      UpdateExamScheduleRequest
    >(`/admin/exam-schedule/${id}`, data);
    return response.data;
  },

  /**
   * DELETE /admin/exam-schedule/:id - Delete single exam schedule
   */
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(
      `/admin/exam-schedule/${id}`,
    );
    return response.data;
  },

  /**
   * DELETE /admin/exam-schedule/delete-multiple - Delete multiple exam schedules
   */
  deleteMultiple: async (
    ids: string[],
  ): Promise<{ message: string; deleted: number }> => {
    const response = await apiClient.delete<
      { message: string; deleted: number },
      { ids: string[] }
    >("/admin/exam-schedule/delete-multiple", { ids });
    return response.data;
  },
};
