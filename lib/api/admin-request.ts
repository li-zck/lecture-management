import { apiClient } from "./client";

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

  rejectLecturerRequest: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.patch<{ message: string }>(
      `/admin/request/lecturer/reject/${id}`,
    );
    return response.data;
  },
};
