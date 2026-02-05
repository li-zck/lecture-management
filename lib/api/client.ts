import Cookies from "js-cookie";
import { BACKEND_URL } from "../utils";

/**
 * API Response wrapper type
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
}

/**
 * API Error type
 */
export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}

/**
 * Request configuration options
 */
interface RequestConfig extends RequestInit {
  params?: Record<string, unknown>;
}

/**
 * Base API client using native fetch
 * Provides type-safe HTTP methods with automatic error handling
 */
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(path: string, params?: Record<string, unknown>): string {
    const url = new URL(`${this.baseURL}${path}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        // Skip undefined values
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const status = response.status;

    // Try to parse JSON response
    let data: T;
    try {
      data = await response.json();
    } catch {
      // If JSON parsing fails, return empty object
      data = {} as T;
    }

    if (!response.ok) {
      // Extract message from response data if available
      const responseData = data as { message?: string | string[] };
      let errorMessage = "An error occurred";

      if (responseData?.message) {
        errorMessage = Array.isArray(responseData.message)
          ? responseData.message[0]
          : responseData.message;
      }

      throw {
        status,
        message: errorMessage,
        details: data,
      } as ApiError;
    }

    return { data, status };
  }

  /**
   * Get access token from cookie
   */
  private getAccessToken(): string | undefined {
    return Cookies.get("accessToken");
  }

  /**
   * GET request
   */
  async get<T>(path: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const url = this.buildURL(path, config?.params);
    const token = this.getAccessToken();

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(config?.headers || {}),
      },
      credentials: "include",
      ...config,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * POST request
   */
  async post<T, B = unknown>(
    path: string,
    body?: B,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    const url = this.buildURL(path, config?.params);
    const token = this.getAccessToken();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(config?.headers || {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
      ...config,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * PATCH request
   */
  async patch<T, B = unknown>(
    path: string,
    body?: B,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    const url = this.buildURL(path, config?.params);
    const token = this.getAccessToken();

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(config?.headers || {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
      ...config,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * PUT request
   */
  async put<T, B = unknown>(
    path: string,
    body?: B,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    const url = this.buildURL(path, config?.params);
    const token = this.getAccessToken();

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(config?.headers || {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
      ...config,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * DELETE request
   */
  async delete<T, B = unknown>(
    path: string,
    body?: B,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    const url = this.buildURL(path, config?.params);
    const token = this.getAccessToken();

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(config?.headers || {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
      ...config,
    });

    return this.handleResponse<T>(response);
  }
}

/**
 * Default API client instance
 */
export const apiClient = new ApiClient(BACKEND_URL);

export default apiClient;
