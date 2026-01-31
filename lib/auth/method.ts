import Cookies from "js-cookie";
import { type ApiResponse, apiClient, getErrorInfo, logError } from "../api";
import type {
  SignInAdminRequest,
  SignInFormData,
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
    const res = await apiClient.post<SignUpResponse, Req>(route, data);

    return res;
  } catch (error: unknown) {
    const { status, message } = getErrorInfo(error);
    logError(error, "Sign Up");
    throw { status, message };
  }
};

export const postSignIn = async <Req>(
  route: string,
  data: Req,
): Promise<ApiResponse<SignInResponse>> => {
  try {
    const res = await apiClient.post<SignInResponse, Req>(route, data);

    return res;
  } catch (error: unknown) {
    const { status, message } = getErrorInfo(error);
    logError(error, "Sign In");
    throw { status, message };
  }
};

export const signUpAdmin = (data: SignUpAdminRequest) =>
  postSignUp(APIROUTES.admin.auth.signup, data);

export const signInAdmin = (data: SignInAdminRequest) =>
  postSignIn(APIROUTES.admin.auth.signin, data);

/**
 * Transform form data to API request format for student sign-in
 */
const transformStudentSignInData = (
  formData: SignInFormData,
): SignInStudentRequest => {
  const { identifier, loginMethod, password } = formData;

  if (loginMethod === "studentId") {
    return { studentId: identifier, password };
  }
  return { username: identifier, password };
};

/**
 * Transform form data to API request format for lecturer sign-in
 */
const transformLecturerSignInData = (
  formData: SignInFormData,
): SignInLecturerRequest => {
  const { identifier, loginMethod, password } = formData;

  if (loginMethod === "lecturerId") {
    return { lecturerId: identifier, password };
  }
  return { username: identifier, password };
};

/**
 * Sign in as a student using either studentId or username
 */
export const signInStudent = (formData: SignInFormData) => {
  const apiData = transformStudentSignInData(formData);
  return postSignIn<SignInStudentRequest>(APIROUTES.auth.student.signin, apiData);
};

/**
 * Sign in as a lecturer using either lecturerId or username
 */
export const signInLecturer = (formData: SignInFormData) => {
  const apiData = transformLecturerSignInData(formData);
  return postSignIn<SignInLecturerRequest>(APIROUTES.auth.lecturer.signin, apiData);
};

export const signOut = () => {
  Cookies.remove("accessToken", { path: "/" });
};
