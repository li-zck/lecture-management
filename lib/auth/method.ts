import { handleApiError, type ErrorResponse } from "../api/errors";
import { POST } from "../axios/method";
import { SignInUser } from "../types/signIn";

export const signInUser = async (
	data: SignInUser,
): Promise<any | ErrorResponse> => {
	try {
		const res = await POST("/auth/login", data);

		return res;
	} catch (error) {
		const errorResponse = handleApiError(error);

		return errorResponse;
	}
};
