import { getErrorMessage } from "@/lib/api";
import { type ApiResponse, POST } from "@/lib/axios";
import type {
  CreateAdminRequest,
  CreateDepartmentRequest,
  CreateLecturerAccountRequest,
  CreateMultipleDepartmentsRequest,
  CreateMultipleLecturersRequest,
  CreateMultipleStudentsRequest,
  CreateStudentAccountRequest,
} from "@/lib/types/dto/api/admin/request/create";
import type {
  CreateAdminResponse,
  CreateDepartmentResponse,
  CreateLecturerAccountResponse,
  CreateStudentAccountResponse,
} from "@/lib/types/dto/api/admin/response/create";
import { APIROUTES } from "@/lib/utils";
import { createLecturerSchema } from "@/lib/zod";

const postCreate = async <TRequest, TResponse>(
  route: string,
  data: TRequest,
): Promise<ApiResponse<TResponse>> => {
  try {
    const res = await POST<TResponse, TRequest>(route, data);

    return res;
  } catch (error: any) {
    const status = error.response.status || 500;
    const message = getErrorMessage(status);

    throw { status, message };
  }
};

/*
 * student methods
 */
export const createStudentAccount = (data: CreateStudentAccountRequest) =>
  postCreate<CreateStudentAccountRequest, CreateStudentAccountResponse>(
    APIROUTES.admin.create.student.each,
    data,
  );

export const createMultipleStudentAccounts = (
  data: CreateMultipleStudentsRequest,
) =>
  postCreate<CreateMultipleStudentsRequest, { message: string }>(
    APIROUTES.admin.create.student.multiple,
    data,
  );

/*
 * lecturer methods
 */
export const createLecturerAccount = (data: CreateLecturerAccountRequest) => {
  postCreate<CreateLecturerAccountRequest, CreateLecturerAccountResponse>(
    APIROUTES.admin.create.lecturer.each,
    data,
  );
};

export const createMultipleLecturerAccounts = (
  data: CreateMultipleLecturersRequest,
) =>
  postCreate<CreateMultipleLecturersRequest, { message: string }>(
    APIROUTES.admin.create.lecturer.multiple,
    data,
  );

/*
 * department methods
 */
export const createDepartment = (data: CreateDepartmentRequest) =>
  postCreate<CreateDepartmentRequest, CreateDepartmentResponse>(
    APIROUTES.admin.create.department.each,
    data,
  );

export const createMultipleDepartments = (
  data: CreateMultipleDepartmentsRequest,
) =>
  postCreate<CreateMultipleDepartmentsRequest, { message: string }>(
    APIROUTES.admin.create.department.multiple,
    data,
  );

/*
 * admin methods
 */
export const createAdmin = (data: CreateAdminRequest) =>
  postCreate<CreateAdminRequest, CreateAdminResponse>(
    APIROUTES.admin.create.admin.each,
    data,
  );
