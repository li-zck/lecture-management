import { apiClient } from "./client";
import Cookies from "js-cookie";

/**
 * Sign in request DTO
 */
export interface SignInRequest {
    username: string;
    password: string;
}

/**
 * Sign in response DTO
 */
export interface SignInResponse {
    token: string;
    message?: string;
}

/**
 * Sign up admin request DTO
 */
export interface SignUpAdminRequest {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    fullName?: string;
}

/**
 * Sign up response DTO
 */
export interface SignUpResponse {
    message: string;
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
            data
        );
        return response.data;
    },

    /**
     * POST /auth/admin/signin - Admin user login
     */
    adminSignIn: async (data: SignInRequest): Promise<SignInResponse> => {
        const response = await apiClient.post<SignInResponse, SignInRequest>(
            "/auth/admin/signin",
            data
        );
        return response.data;
    },

    /**
     * POST /auth/student/signin - Student user login
     */
    studentSignIn: async (data: SignInRequest): Promise<SignInResponse> => {
        const response = await apiClient.post<SignInResponse, SignInRequest>(
            "/auth/student/signin",
            data
        );
        return response.data;
    },

    /**
     * POST /auth/lecturer/signin - Lecturer user login
     */
    lecturerSignIn: async (data: SignInRequest): Promise<SignInResponse> => {
        const response = await apiClient.post<SignInResponse, SignInRequest>(
            "/auth/lecturer/signin",
            data
        );
        return response.data;
    },

    /**
     * Sign out - Clear authentication cookie
     */
    signOut: () => {
        Cookies.remove("accessToken", { path: "/" });
    },
};
