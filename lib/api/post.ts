import { apiClient } from "./client";

/**
 * Post type enum
 */
export type PostType = "NEWS" | "ANNOUNCEMENT";

/**
 * Public Post interface
 */
export interface PublicPost {
  id: string;
  title: string;
  content: string;
  type: PostType;
  adminId: string;
  admin?: {
    id: string;
    email: string;
    username: string;
  } | null;
  departmentId: string | null;
  department?: {
    id: string;
    name: string;
  } | null;
  thumbnail: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Query parameters for post endpoints
 */
export interface PostQueryParams {
  includeAdmin?: boolean;
  includeDepartment?: boolean;
}

/**
 * Public Post API
 * Public endpoints for viewing posts/announcements
 */
export const postApi = {
  /**
   * GET /post/global - Get global posts
   */
  getGlobal: async (params?: PostQueryParams): Promise<PublicPost[]> => {
    const response = await apiClient.get<PublicPost[]>("/post/global", {
      params: {
        includeAdmin: params?.includeAdmin ? "true" : undefined,
        includeDepartment: params?.includeDepartment ? "true" : undefined,
      },
    });
    return response.data;
  },

  /**
   * GET /post/department/:departmentId - Get posts by department
   */
  getByDepartment: async (
    departmentId: string,
    params?: PostQueryParams,
  ): Promise<PublicPost[]> => {
    const response = await apiClient.get<PublicPost[]>(
      `/post/department/${departmentId}`,
      {
        params: {
          includeAdmin: params?.includeAdmin ? "true" : undefined,
          includeDepartment: params?.includeDepartment ? "true" : undefined,
        },
      },
    );
    return response.data;
  },

  /**
   * GET /post/find/:id - Get post by ID
   */
  getById: async (
    id: string,
    params?: PostQueryParams,
  ): Promise<PublicPost> => {
    const response = await apiClient.get<PublicPost>(`/post/find/${id}`, {
      params: {
        includeAdmin: params?.includeAdmin ? "true" : undefined,
        includeDepartment: params?.includeDepartment ? "true" : undefined,
      },
    });
    return response.data;
  },
};
