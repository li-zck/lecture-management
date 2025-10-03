import { z, ZodError } from "zod";

export const ErrorCode = z.enum([
	"bad_request",
	"not_found",
	"internal_server_error",
	"unauthorized",
	"forbidden",
	"too_many_requests",
	"conflict",
	"unprocessable_content",
]);

const errorCodeToHttpStatus: Record<z.infer<typeof ErrorCode>, number> = {
	bad_request: 400,
	not_found: 404,
	internal_server_error: 500,
	unauthorized: 401,
	forbidden: 403,
	too_many_requests: 429,
	conflict: 409,
	unprocessable_content: 422,
};

const ErrorSchema = z.object({
	error: z.object({
		code: ErrorCode,
		message: z.string(),
	}),
});

export type ErrorResponse = z.infer<typeof ErrorSchema>;

export const handleApiError = (
	error: any,
): ErrorResponse & { status: number } => {
	console.error(error.message);

	if (error instanceof ZodError) {
		return {
			error: {
				code: "unprocessable_content",
				message: error.issues[0]?.message || "Validation failed",
			},

			status: errorCodeToHttpStatus.unprocessable_content,
		};
	}

	return {
		error: {
			code: "internal_server_error",
			message: "An internal server error occurred. Please contact support.",
		},

		status: 500,
	};
};
