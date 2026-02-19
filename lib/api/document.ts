import Cookies from "js-cookie";
import { BACKEND_URL } from "../utils";
import { apiClient } from "./client";

/**
 * Course Document interface
 */
export interface CourseDocument {
  id: string;
  courseOnSemesterId: string;
  title: string;
  path: string;
  url: string | null;
  createdAt: string;
  updatedAt: string;
  courseOnSemester?: {
    id: string;
    course?: {
      id: string;
      name: string;
      description: string | null;
      credits: number;
    };
  } | null;
}

/**
 * Create document request DTO
 */
export interface CreateDocumentRequest {
  title: string;
  courseOnSemesterId: string;
}

/**
 * Update document request DTO
 */
export interface UpdateDocumentRequest {
  title?: string;
}

/**
 * Document API
 * GET endpoints require authentication
 * POST/PATCH/DELETE endpoints require lecturer authentication
 */
export const documentApi = {
  /**
   * GET /document/all - Get all documents
   */
  getAll: async (): Promise<CourseDocument[]> => {
    const response = await apiClient.get<CourseDocument[]>("/document/all");
    return response.data;
  },

  /**
   * GET /document/find/:id - Get document by ID
   */
  getById: async (id: string): Promise<CourseDocument> => {
    const response = await apiClient.get<CourseDocument>(
      `/document/find/${id}`,
    );
    return response.data;
  },

  /**
   * POST /document/create - Create document (Lecturer only)
   * Supports file upload via multipart/form-data
   */
  create: async (
    data: CreateDocumentRequest,
    file: File,
  ): Promise<CourseDocument> => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("courseOnSemesterId", data.courseOnSemesterId);
    formData.append("file", file);

    const response = await apiClient.post<CourseDocument, FormData>(
      "/document/create",
      formData,
    );
    return response.data;
  },

  /**
   * PATCH /document/update/:id - Update document (Lecturer only)
   * Optionally supports file upload via multipart/form-data
   */
  update: async (
    id: string,
    data: UpdateDocumentRequest,
    file?: File,
  ): Promise<CourseDocument> => {
    const formData = new FormData();
    if (data.title) {
      formData.append("title", data.title);
    }
    if (file) {
      formData.append("file", file);
    }

    const response = await apiClient.patch<CourseDocument, FormData>(
      `/document/update/${id}`,
      formData,
    );
    return response.data;
  },

  /**
   * DELETE /document/delete/:id - Delete document (Lecturer only)
   */
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(
      `/document/delete/${id}`,
    );
    return response.data;
  },

  /**
   * Download document file - fetches with auth and triggers browser download
   */
  download: async (id: string, filename?: string): Promise<void> => {
    const token = Cookies.get("accessToken");
    const response = await fetch(`${BACKEND_URL}/document/download/${id}`, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to download document");
    const blob = await response.blob();
    const disposition = response.headers.get("Content-Disposition");
    const name =
      filename ??
      disposition?.match(/filename="?([^";\n]+)"?/)?.[1] ??
      "document";
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  },
};
