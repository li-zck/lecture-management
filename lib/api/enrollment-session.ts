import { apiClient } from "./client";
// EnrollmentSession type is exported from admin-enrollment-session.ts
import type { EnrollmentSession } from "./admin-enrollment-session";

/**
 * Public Enrollment Session API
 * Endpoints for students/lecturers to view active enrollment sessions
 * All endpoints require authentication
 */
export const enrollmentSessionApi = {
  /**
   * GET /enrollment/session/all - Get all active enrollment sessions
   */
  getAllActive: async (): Promise<EnrollmentSession[]> => {
    const response = await apiClient.get<EnrollmentSession[]>(
      "/enrollment/session/all",
    );
    return response.data;
  },

  /**
   * GET /enrollment/session/find/:id - Get active session by ID
   */
  getActiveById: async (id: string): Promise<EnrollmentSession> => {
    const response = await apiClient.get<EnrollmentSession>(
      `/enrollment/session/find/${id}`,
    );
    return response.data;
  },

  /**
   * GET /enrollment/session/semester/:semesterId - Get active sessions by semester
   */
  getActiveBySemester: async (
    semesterId: string,
  ): Promise<EnrollmentSession[]> => {
    const response = await apiClient.get<EnrollmentSession[]>(
      `/enrollment/session/semester/${semesterId}`,
    );
    return response.data;
  },
};
