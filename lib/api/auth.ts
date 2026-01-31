import Cookies from "js-cookie";
import { apiClient } from "./client";

/**
 * Admin sign in request DTO
 */
export interface SignInAdminRequest {
	username: string;
	password: string;
}

/**
 * Student sign in request DTO - either studentId OR username must be provided
 */
export interface SignInStudentRequest {
	studentId?: string;
	username?: string;
	password: string;
}

/**
 * Lecturer sign in request DTO - either lecturerId OR username must be provided
 */
export interface SignInLecturerRequest {
	lecturerId?: string;
	username?: string;
	password: string;
}

/**
 * Sign in response DTO
 */
export interface SignInResponse {
	accessToken: string;
	message?: string;
}

/**
 * Sign up admin request DTO
 */
export interface SignUpAdminRequest {
	username: string;
	password: string;
	confirmPassword: string;
}

/**
 * Sign up response DTO
 */
export interface SignUpResponse {
	accessToken: string;
	message?: string;
}

/**
 * Authentication API methods
 */
export const authApi = {
	/**
	 * POST /auth/admin/signup - Admin user registration
	 */
	adminSignUp: async (data: SignUpAdminRequest): Promise<SignUpResponse> => {
		const response = await apiClient.post<SignUpResponse, SignUpAdminRequest>(
			"/auth/admin/signup",
			data,
		);
		return response.data;
	},

	/**
	 * POST /auth/admin/signin - Admin user login
	 */
	adminSignIn: async (data: SignInAdminRequest): Promise<SignInResponse> => {
		const response = await apiClient.post<SignInResponse, SignInAdminRequest>(
			"/auth/admin/signin",
			data,
		);
		return response.data;
	},

	/**
	 * POST /auth/student/signin - Student user login
	 * Accepts either studentId or username for identification
	 */
	studentSignIn: async (
		data: SignInStudentRequest,
	): Promise<SignInResponse> => {
		const response = await apiClient.post<SignInResponse, SignInStudentRequest>(
			"/auth/student/signin",
			data,
		);
		return response.data;
	},

	/**
	 * POST /auth/lecturer/signin - Lecturer user login
	 * Accepts either lecturerId or username for identification
	 */
	lecturerSignIn: async (
		data: SignInLecturerRequest,
	): Promise<SignInResponse> => {
		const response = await apiClient.post<
			SignInResponse,
			SignInLecturerRequest
		>("/auth/lecturer/signin", data);
		return response.data;
	},

	/**
	 * Sign out - Clear authentication cookie
	 */
	signOut: () => {
		Cookies.remove("accessToken", { path: "/" });
	},
};
