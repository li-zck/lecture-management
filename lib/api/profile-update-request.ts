import { apiClient } from "./client";

export interface CreateProfileUpdateRequestPayload {
  requestedData: Record<string, unknown>;
}

export interface ProfileChangeCooldownStatus {
  canUpdateProfile: boolean;
  profileChangeCooldownUntil: string | null;
}

export const profileUpdateRequestApi = {
  getCooldown: async (): Promise<ProfileChangeCooldownStatus> => {
    const response = await apiClient.get<ProfileChangeCooldownStatus>(
      "/profile-update-request/cooldown",
    );
    return response.data;
  },

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
