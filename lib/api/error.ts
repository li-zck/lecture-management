export const getErrorMessage = (
	status: number,
	fallbackMessage = "An error occurred",
): string => {
	const messages: Record<number, string> = {
		400: "Invalid request data",
		401: "Authentication required",
		403: "Access denied",
		404: "Resource not found",
		409: "Account already exists",
		422: "Validation failed",
		429: "Too many requests, please try again later",
		500: "Server error, please try again",
	};

	return messages[status] || fallbackMessage;
};
