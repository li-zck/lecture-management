/**
 * API Error utilities
 * Provides helper functions for extracting error information and logging
 */

export interface ApiErrorInfo {
	status: number;
	message: string;
	details?: unknown;
}

/**
 * Extract error information from an unknown error object
 * @param error - The error object (typically from a catch block)
 * @returns Normalized error info with status, message, and details
 */
export const getErrorInfo = (error: unknown): ApiErrorInfo => {
	if (typeof error === "object" && error !== null) {
		const err = error as {
			status?: number;
			message?: string;
			details?: unknown;
			response?: { data?: { message?: string }; status?: number };
		};

		// Handle API client errors (has status property directly)
		if (err.status !== undefined) {
			return {
				status: err.status,
				message: err.message || "An error occurred",
				details: err.details,
			};
		}

		// Handle axios-style errors (has response property)
		if (err.response) {
			return {
				status: err.response.status || 500,
				message:
					err.response.data?.message || err.message || "An error occurred",
				details: err.response.data,
			};
		}

		// Handle standard Error objects
		if (err.message) {
			return {
				status: 500,
				message: err.message,
				details: undefined,
			};
		}
	}

	return {
		status: 500,
		message: "An unexpected error occurred",
		details: undefined,
	};
};

/**
 * Log error details to console for debugging
 * @param error - The error object
 * @param context - Optional context string for where the error occurred
 */
export const logError = (error: unknown, context?: string): void => {
	const prefix = context ? `[${context}]` : "[API Error]";
	const errorInfo = getErrorInfo(error);

	console.error(`${prefix} Status: ${errorInfo.status}`, {
		message: errorInfo.message,
		details: errorInfo.details,
	});
};
