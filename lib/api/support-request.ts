import { apiClient } from "./client";

export interface CreateSupportRequestPayload {
  name: string;
  email: string;
  role: string;
  category: string;
  subject: string;
  message: string;
  userId?: string;
}

export interface SupportRequestItem {
  id: string;
  name: string;
  email: string;
  role: string;
  category: string;
  subject: string;
  message: string;
  userId: string | null;
  createdAt: string;
}

export const supportRequestApi = {
  create: async (
    payload: CreateSupportRequestPayload,
  ): Promise<{ id: string; createdAt: string }> => {
    const response = await apiClient.post<
      { id: string; createdAt: string },
      CreateSupportRequestPayload
    >("/support-request", payload);
    return response.data;
  },
};
