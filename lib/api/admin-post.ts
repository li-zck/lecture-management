import { apiClient } from "./client";

/**
 * Post type enum
 */
export type PostType = "NEWS" | "ANNOUNCEMENT";

/**
 * Post interface
 */
export interface Post {
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
  isPublic: boolean;
  thumbnail: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create post request DTO
 */
export interface CreatePostRequest {
  title: string;
  content: string;
  type?: PostType;
  departmentId?: string;
  thumbnail?: string;
  isPublic?: boolean;
}

/**
 * Update post request DTO
 */
export interface UpdatePostRequest {
  title?: string;
  content?: string;
  type?: PostType;
  departmentId?: string | null;
  thumbnail?: string | null;
  isPublic?: boolean | null;
}

/**
 * Query parameters for fetching posts
 */
export interface PostQueryParams {
  includeAdmin?: boolean;
  includeDepartment?: boolean;
}

/**
 * Admin Post Management API
 * All endpoints require admin authentication
 */
export const adminPostApi = {
  /**
   * GET /admin/post/all - Get all posts
   */
  getAll: async (params?: PostQueryParams): Promise<Post[]> => {
    const response = await apiClient.get<Post[]>("/admin/post/all", {
      params: {
        includeAdmin: params?.includeAdmin ? "true" : undefined,
        includeDepartment: params?.includeDepartment ? "true" : undefined,
      },
    });
    return response.data;
  },

  /**
   * GET /admin/post/find/:id - Get post by ID
   */
  getById: async (id: string, params?: PostQueryParams): Promise<Post> => {
    const response = await apiClient.get<Post>(`/admin/post/find/${id}`, {
      params: {
        includeAdmin: params?.includeAdmin ? "true" : undefined,
        includeDepartment: params?.includeDepartment ? "true" : undefined,
      },
    });
    return response.data;
  },

  /**
   * GET /admin/post/department/:departmentId - Get posts by department
   */
  getByDepartment: async (
    departmentId: string,
    params?: PostQueryParams,
  ): Promise<Post[]> => {
    const response = await apiClient.get<Post[]>(
      `/admin/post/department/${departmentId}`,
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
   * GET /admin/post/global - Get global posts (no department)
   */
  getGlobal: async (params?: PostQueryParams): Promise<Post[]> => {
    const response = await apiClient.get<Post[]>("/admin/post/global", {
      params: {
        includeAdmin: params?.includeAdmin ? "true" : undefined,
        includeDepartment: params?.includeDepartment ? "true" : undefined,
      },
    });
    return response.data;
  },

  /**
   * POST /admin/post/create - Create post
   */
  create: async (data: CreatePostRequest): Promise<Post> => {
    const response = await apiClient.post<Post, CreatePostRequest>(
      "/admin/post/create",
      data,
    );
    return response.data;
  },

  /**
   * PATCH /admin/post/update/:id - Update post
   */
  update: async (id: string, data: UpdatePostRequest): Promise<Post> => {
    const response = await apiClient.patch<Post, UpdatePostRequest>(
      `/admin/post/update/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * DELETE /admin/post/delete/:id - Delete single post
   */
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(
      `/admin/post/delete/${id}`,
    );
    return response.data;
  },

  /**
   * DELETE /admin/post/delete - Delete multiple posts
   */
  deleteMultiple: async (
    ids: string[],
  ): Promise<{ message: string; deleted: number }> => {
    const response = await apiClient.delete<
      { message: string; deleted: number },
      undefined
    >(`/admin/post/delete?ids=${ids.join(",")}`);
    return response.data;
  },
};
