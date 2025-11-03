import Cookies from "js-cookie";
import { getErrorMessage } from "../api/error";
import { type ApiResponse, POST } from "../axios";
import type {
	SignInAdminRequest,
	SignInLecturerRequest,
	SignInStudentRequest,
	SignUpAdminRequest,
} from "../types/dto/api/request/auth";
import type { SignInResponse } from "../types/dto/api/response/auth/sign-in.dto";
import type { SignUpResponse } from "../types/dto/api/response/auth/sign-up.dto";
import { APIROUTES } from "../utils";

export const postSignUp = async <Req>(
	route: string,
	data: Req,
): Promise<ApiResponse<SignUpResponse>> => {
	try {
		const res = await POST<SignUpResponse, Req>(route, data);

		return res;
	} catch (error: any) {
		const status = error.response?.status || 500;
		const message = getErrorMessage(status);

		throw new Error(message);
	}
};

export const postSignIn = async <Req>(
	route: string,
	data: Req,
): Promise<ApiResponse<SignInResponse>> => {
	try {
		const res = await POST<SignInResponse, Req>(route, data);

		return res;
	} catch (error: any) {
		const status = error.response?.status || 500;
		const message = getErrorMessage(status);

		throw { status, message };
	}
};

export const signUpAdmin = (data: SignUpAdminRequest) =>
	postSignUp(APIROUTES.admin.auth.signup, data);

export const signInAdmin = (data: SignInAdminRequest) =>
	postSignIn(APIROUTES.admin.auth.signin, data);

export const signInStudent = (data: SignInStudentRequest) =>
	postSignIn(APIROUTES.auth.student.signin, data);

export const signInLecturer = (data: SignInLecturerRequest) =>
	postSignIn(APIROUTES.auth.lecturer.signin, data);

export const signOut = () => {
	Cookies.remove("accessToken", { path: "/" });

	return true;
};
