import { ErrorResponse, handleApiError } from "../api/errors";
import { POST } from "../axios";
import {
	SignInAdmin,
	SignInUser,
	SignUpAdmin,
	SignUpUser,
} from "../types/auth";
import { ROUTES } from "./routes";
import Cookies from "js-cookie";

export const signInUser = async (
	data: SignInUser,
): Promise<any | ErrorResponse> => {
	try {
		const res = await POST(ROUTES.STUDENT.SIGNIN, data);

		return res;
	} catch (error) {
		const errorResponse = handleApiError(error);

		return errorResponse;
	}
};

export const signUpUser = async (
	data: SignUpUser,
): Promise<any | ErrorResponse> => {
	try {
		const res = await POST(ROUTES.STUDENT.SIGNUP, data);

		return res;
	} catch (error) {
		const errorResponse = handleApiError(error);

		return errorResponse;
	}
};

export const signUpAdmin = async (
	data: SignUpAdmin,
): Promise<any | ErrorResponse> => {
	try {
		const res = await POST(ROUTES.ADMIN.SIGNUP, data);

		return res;
	} catch (error) {
		const errorResponse = handleApiError(error);

		return errorResponse;
	}
};

export const signInAdmin = async (
	data: SignInAdmin,
): Promise<any | ErrorResponse> => {
	try {
		const res = await POST(ROUTES.ADMIN.SIGNIN, data);

		return res;
	} catch (error) {
		const errorResponse = handleApiError(error);

		return errorResponse;
	}
};

export const signOut = async () => {
	try {
		Cookies.remove("accessToken");

		// return res;
	} catch (error) {
		const errorResponse = handleApiError(error);

		return errorResponse;
	}
};
