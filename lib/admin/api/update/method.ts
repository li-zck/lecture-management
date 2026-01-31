import { type ApiResponse, apiClient } from "@/lib/api";
import type {
  UpdateAdminRequest,
  UpdateDepartmentRequest,
  UpdateLecturerAccountRequest,
  UpdateStudentAccountRequest,
} from "@/lib/types/dto/api/admin/request/update";
import type {
  UpdateAdminResponse,
  UpdateDepartmentResponse,
  UpdateLecturerAccountResponse,
  UpdateStudentAccountResponse,
} from "@/lib/types/dto/api/admin/response/update";
import { APIROUTES } from "@/lib/utils";

const patch = async <TRequest, TResponse>(
  route: string,
  data: TRequest,
): Promise<ApiResponse<TResponse>> => {
  const res = await apiClient.patch<TResponse, TRequest>(route, data);
  return res;
};

/*
 * student methods
 */
export const updateStudentAccount = (
  data: UpdateStudentAccountRequest,
  studentId: string,
) =>
  patch<UpdateStudentAccountRequest, UpdateStudentAccountResponse>(
    APIROUTES.admin.update.student.each.replace(":id", studentId),
    data,
  );

/*
 * lecturer methods
 */
export const updateLecturerAccount = (
  data: UpdateLecturerAccountRequest,
  lecturerId: string,
) =>
  patch<UpdateLecturerAccountRequest, UpdateLecturerAccountResponse>(
    APIROUTES.admin.update.lecturer.each.replace(":id", lecturerId),
    data,
  );

/*
 * department methods
 */
export const updateDepartment = (
  data: UpdateDepartmentRequest,
  departmentId: string,
) =>
  patch<UpdateDepartmentRequest, UpdateDepartmentResponse>(
    APIROUTES.admin.update.department.each.replace(":id", departmentId),
    data,
  );

/*
 * admin methods
 */
export const updateAdminAccount = (
  data: UpdateAdminRequest,
  adminId: string,
) =>
  patch<UpdateAdminRequest, UpdateAdminResponse>(
    APIROUTES.admin.update.admin.each.replace(":id", adminId),
    data,
  );
