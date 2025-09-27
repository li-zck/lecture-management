import { z, ZodError } from "zod";

export const ErrorCode = z.enum([
	"bad_request",
	"not_found",
	"internal_server_error",
	"unauthorized",
	"forbidden",
	"rate_limit_exceeded",
	"conflict",
	"unprocessable_entity",
]);

const errorCodeToHttpStatus: Record<z.infer<typeof ErrorCode>, number> = {
	bad_request: 400,
	unauthorized: 401,
	forbidden: 403,
	not_found: 404,
	conflict: 409,
	unprocessable_entity: 422,
	rate_limit_exceeded: 429,
	internal_server_error: 500,
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
				code: "unprocessable_entity",
				message: error.issues[0]?.message || "Validation failed",
			},

			status: errorCodeToHttpStatus.unprocessable_entity,
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
