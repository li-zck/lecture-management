import { apiClient } from "./client";
import type { SupportRequestItem } from "./support-request";

export type LecturerTeachingRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface LecturerTeachingRequestAdmin {
  id: string;
  lecturerId: string;
  courseOnSemesterId: string;
  status: LecturerTeachingRequestStatus;
  createdAt: string;
  updatedAt: string;
  lecturer: {
    id: string;
    fullName: string | null;
    lecturerId: string;
    email: string;
  };
  courseOnSemester: {
    id: string;
    course: {
      id: string;
      name: string;
      department?: { id: string; name: string } | null;
    };
    semester: {
      id: string;
      name: string;
      startDate: string;
      endDate: string;
    };
    dayOfWeek: number | null;
    startTime: number | null;
    endTime: number | null;
    location: string | null;
  };
}

export type ProfileUpdateRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ProfileUpdateRequestAdmin {
  id: string;
  userId: string;
  role: string;
  requestedData: Record<string, unknown>;
  status: ProfileUpdateRequestStatus;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string | null;
    studentId?: string;
    lecturerId?: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    gender?: boolean | null;
    birthDate?: string | null;
    citizenId?: string | null;
  };
}

export type CourseWithdrawalRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface CourseWithdrawalRequestAdmin {
  id: string;
  studentId: string;
  enrollmentId?: string | null;
  courseOnSemesterId: string;
  reason: string;
  details?: string | null;
  status: CourseWithdrawalRequestStatus;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    fullName: string | null;
    studentId: string | null;
    email: string;
  };
  enrollment?: {
    id: string;
    courseOnSemester: {
      id: string;
      course: {
        id: string;
        name: string;
        department?: { id: string; name: string } | null;
      };
      semester: {
        id: string;
        name: string;
      };
    };
  } | null;
}

export const adminRequestApi = {
  getLecturerRequests: async (
    status?: LecturerTeachingRequestStatus,
  ): Promise<LecturerTeachingRequestAdmin[]> => {
    const response = await apiClient.get<LecturerTeachingRequestAdmin[]>(
      "/admin/request/lecturer/all",
      { params: status ? { status } : {} },
    );
    return response.data ?? [];
  },

  approveLecturerRequest: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.patch<{ message: string }>(
      `/admin/request/lecturer/approve/${id}`,
    );
    return response.data;
  },

  rejectLecturerRequest: async (
    id: string,
    reason: string,
  ): Promise<{ message: string }> => {
    const response = await apiClient.patch<{ message: string }>(
      `/admin/request/lecturer/reject/${id}`,
      { reason },
    );
    return response.data;
  },

  getProfileUpdateRequests: async (
    status?: ProfileUpdateRequestStatus,
  ): Promise<ProfileUpdateRequestAdmin[]> => {
    const response = await apiClient.get<ProfileUpdateRequestAdmin[]>(
      "/admin/profile-update-request/all",
      { params: status ? { status } : {} },
    );
    return response.data ?? [];
  },

  approveProfileUpdateRequest: async (id: string) => {
    const response = await apiClient.patch(
      `/admin/profile-update-request/approve/${id}`,
    );
    return response.data;
  },

  rejectProfileUpdateRequest: async (id: string, reason: string) => {
    const response = await apiClient.patch(
      `/admin/profile-update-request/reject/${id}`,
      { reason },
    );
    return response.data;
  },

  unlockProfileChangeCooldown: async (
    userId: string,
    role: "student" | "lecturer",
  ): Promise<{ ok: boolean }> => {
    const response = await apiClient.post<{ ok: boolean }>(
      `/admin/profile-update-request/unlock/${userId}`,
      undefined,
      { params: { role } },
    );
    return response.data;
  },

  getStudentWithdrawalRequests: async (
    status?: CourseWithdrawalRequestStatus,
  ): Promise<CourseWithdrawalRequestAdmin[]> => {
    const response = await apiClient.get<CourseWithdrawalRequestAdmin[]>(
      "/admin/request/student/withdrawal/all",
      { params: status ? { status } : {} },
    );
    return response.data ?? [];
  },

  approveStudentWithdrawalRequest: async (
    id: string,
  ): Promise<{ message: string }> => {
    const response = await apiClient.patch<{ message: string }>(
      `/admin/request/student/withdrawal/approve/${id}`,
    );
    return response.data;
  },

  rejectStudentWithdrawalRequest: async (
    id: string,
    reason: string,
  ): Promise<{ message: string }> => {
    const response = await apiClient.patch<{ message: string }>(
      `/admin/request/student/withdrawal/reject/${id}`,
      { reason },
    );
    return response.data;
  },

  getSupportRequests: async (): Promise<SupportRequestItem[]> => {
    const response = await apiClient.get<SupportRequestItem[]>(
      "/admin/support-request/all",
    );
    return response.data ?? [];
  },
};
