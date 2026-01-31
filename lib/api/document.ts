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
	 * GET /document/:id - Get document by ID
	 * Note: Backend uses @Query('id') instead of @Param('id')
	 */
	getById: async (id: string): Promise<CourseDocument> => {
		const response = await apiClient.get<CourseDocument>("/document/:id", {
			params: { id },
		});
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
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			},
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
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			},
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
};
