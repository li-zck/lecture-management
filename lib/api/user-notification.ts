import { apiClient } from "./client";

/**
 * Notification type enum
 */
export type NotificationType = "INFO" | "WARNING" | "ALERT";

/**
 * User Notification interface
 */
export interface UserNotification {
  id: string;
  title: string;
  message: string;
  url: string | null;
  type: NotificationType;
  studentId: string | null;
  lecturerId: string | null;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    fullName: string | null;
    studentId: string | null;
  } | null;
  lecturer?: {
    id: string;
    fullName: string | null;
    lecturerId: string;
  } | null;
}

/**
 * Student Notification API
 * All endpoints require student authentication
 */
export const studentNotificationApi = {
  /**
   * GET /notification/student/all - Get all student notifications
   */
  getAll: async (): Promise<UserNotification[]> => {
    const response = await apiClient.get<UserNotification[]>(
      "/notification/student/all",
    );
    return response.data;
  },

  /**
   * GET /notification/student/:id - Get notification by ID
   */
  getById: async (id: string): Promise<UserNotification> => {
    const response = await apiClient.get<UserNotification>(
      `/notification/student/${id}`,
    );
    return response.data;
  },

  /**
   * PATCH /notification/student/all/read - Mark all notifications as read
   */
  markAllAsRead: async (): Promise<{ count: number }> => {
    const response = await apiClient.patch<{ count: number }>(
      "/notification/student/all/read",
    );
    return response.data;
  },

  /**
   * DELETE /notification/student/all - Delete all notifications
   */
  deleteAll: async (): Promise<{ count: number }> => {
    const response = await apiClient.delete<{ count: number }>(
      "/notification/student/all",
    );
    return response.data;
  },

  /**
   * DELETE /notification/student/:id - Delete notification by ID
   */
  delete: async (id: string): Promise<{ count: number }> => {
    const response = await apiClient.delete<{ count: number }>(
      `/notification/student/${id}`,
    );
    return response.data;
  },
};

/**
 * Lecturer Notification API
 * All endpoints require lecturer authentication
 */
export const lecturerNotificationApi = {
  /**
   * GET /notification/lecturer/all - Get all lecturer notifications
   */
  getAll: async (): Promise<UserNotification[]> => {
    const response = await apiClient.get<UserNotification[]>(
      "/notification/lecturer/all",
    );
    return response.data;
  },

  /**
   * GET /notification/lecturer/:id - Get notification by ID
   */
  getById: async (id: string): Promise<UserNotification> => {
    const response = await apiClient.get<UserNotification>(
      `/notification/lecturer/${id}`,
    );
    return response.data;
  },

  /**
   * PATCH /notification/lecturer/all/read - Mark all notifications as read
   */
  markAllAsRead: async (): Promise<{ count: number }> => {
    const response = await apiClient.patch<{ count: number }>(
      "/notification/lecturer/all/read",
    );
    return response.data;
  },

  /**
   * DELETE /notification/lecturer/all - Delete all notifications
   */
  deleteAll: async (): Promise<{ count: number }> => {
    const response = await apiClient.delete<{ count: number }>(
      "/notification/lecturer/all",
    );
    return response.data;
  },

  /**
   * DELETE /notification/lecturer/:id - Delete notification by ID
   */
  delete: async (id: string): Promise<{ count: number }> => {
    const response = await apiClient.delete<{ count: number }>(
      `/notification/lecturer/${id}`,
    );
    return response.data;
  },
};
