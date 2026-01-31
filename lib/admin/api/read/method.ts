import { type ApiResponse, apiClient } from "@/lib/api";
import type { FindStudentByConditionRequest } from "@/lib/types/dto/api/admin/request/read";
import type {
  DepartmentResponse,
  LecturerAccountResponse,
  ReadAdminAccountResponse,
  ReadAllAdminAccountsResponse,
  ReadAllDepartmentResponse,
  ReadAllLecturerAccountResponse,
  ReadAllStudentAccountsResponse,
  StudentAccountResponse,
} from "@/lib/types/dto/api/admin/response/read/read.dto";
import { APIROUTES } from "@/lib/utils";

const get = async <TResponse>(
  route: string,
  params?: any,
): Promise<ApiResponse<TResponse>> => {
  const res = await apiClient.get<TResponse>(route, { params });
  return res;
};

/*
 * Student methods
 * */
export const getAllStudentAccounts = () =>
  get<ReadAllStudentAccountsResponse>(APIROUTES.admin.view.student.all);

export const getStudentById = (studentId: string) =>
  get<StudentAccountResponse>(
    APIROUTES.admin.view.student.each.replace(":id", studentId),
  );

export const findStudentByCondition = (params: FindStudentByConditionRequest) =>
  get<StudentAccountResponse>(APIROUTES.admin.view.student.find, params);

/*
 * Lecturer methods
 * */
export const getAllLecturerAccounts = () =>
  get<ReadAllLecturerAccountResponse>(APIROUTES.admin.view.lecturer.all);

export const getLecturerById = (lecturerId: string) =>
  get<LecturerAccountResponse>(
    APIROUTES.admin.view.lecturer.each.replace(":id", lecturerId),
  );

/*
 * Department methods
 * */
export const getAllDepartments = () =>
  get<ReadAllDepartmentResponse>(APIROUTES.admin.view.department.all);

export const getDepartmentById = (departmentId: string) =>
  get<DepartmentResponse>(
    APIROUTES.admin.view.department.each.replace(":id", departmentId),
  );

export const getAllAdmins = () =>
  get<ReadAllAdminAccountsResponse>(APIROUTES.admin.view.admin.all);

export const getAdminById = (adminId: string) =>
  get<ReadAdminAccountResponse>(
    APIROUTES.admin.view.admin.each.replace(":id", adminId),
  );
