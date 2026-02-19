import { apiClient } from "./client";

export interface CreateProfileUpdateRequestPayload {
  requestedData: Record<string, unknown>;
}

export const profileUpdateRequestApi = {
  create: async (
    payload: CreateProfileUpdateRequestPayload,
  ): Promise<{ id: string; status: string }> => {
    const response = await apiClient.post<{ id: string; status: string }>(
      "/profile-update-request",
      payload,
    );
    return response.data;
  },
};
