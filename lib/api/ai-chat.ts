import { apiClient } from "./client";

export type AiPreset =
  | "schedule_insights"
  | "schedule_optimizer"
  | "general"
  | "academic_advisor"
  | "course_analytics";

export interface AiConversationSummary {
  id: string;
  title: string;
  preset: string | null;
  createdAt: string;
  updatedAt: string;
  _count: { messages: number };
}

export interface AiMessage {
  id: string;
  conversationId: string;
  role: "user" | "model";
  content: string;
  createdAt: string;
}

export interface AiConversation {
  id: string;
  title: string;
  preset: string | null;
  createdAt: string;
  updatedAt: string;
  messages: AiMessage[];
}

export interface AiConsent {
  accepted: boolean;
  acceptedAt: string | null;
  version: string | null;
}

export const aiChatApi = {
  listConversations: async (): Promise<AiConversationSummary[]> => {
    const res =
      await apiClient.get<AiConversationSummary[]>("/ai/conversations");
    return res.data;
  },

  createConversation: async (dto: {
    title?: string;
    preset?: AiPreset;
  }): Promise<AiConversation> => {
    const res = await apiClient.post<AiConversation>("/ai/conversations", dto);
    return res.data;
  },

  getConversation: async (id: string): Promise<AiConversation> => {
    const res = await apiClient.get<AiConversation>(`/ai/conversations/${id}`);
    return res.data;
  },

  updateConversation: async (
    id: string,
    dto: { title?: string },
  ): Promise<AiConversation> => {
    const res = await apiClient.patch<AiConversation>(
      `/ai/conversations/${id}`,
      dto,
    );
    return res.data;
  },

  deleteConversation: async (id: string): Promise<{ success: boolean }> => {
    const res = await apiClient.delete<{ success: boolean }>(
      `/ai/conversations/${id}`,
    );
    return res.data;
  },

  sendMessage: async (
    conversationId: string,
    content: string,
  ): Promise<AiMessage> => {
    const res = await apiClient.post<AiMessage>(
      `/ai/conversations/${conversationId}/messages`,
      { content },
    );
    return res.data;
  },

  getConsent: async (): Promise<AiConsent> => {
    const res = await apiClient.get<AiConsent>("/ai/consent");
    return res.data;
  },

  acceptConsent: async (version: string): Promise<AiConsent> => {
    const res = await apiClient.post<AiConsent>("/ai/consent", { version });
    return res.data;
  },
};
