import { getErrorMessage } from "@/lib/api";
import { ApiResponse, GET } from "@/lib/axios";
import {
	ReadAllLecturerAccountResponse,
	ReadAllStudentAccountsResponse,
	ReadAllDepartmentResponse,
	StudentAccountResponse,
	LecturerAccountResponse,
	DepartmentResponse,
} from "@/lib/types/dto/api/admin/response/read/read.dto";
import { APIROUTES } from "@/lib/utils";

const get = async <TResponse>(
	route: string,
): Promise<ApiResponse<TResponse>> => {
	try {
		const res = await GET<TResponse>(route);

		return res;
	} catch (error: any) {
		const status = error.response?.status || 500;
		const message = getErrorMessage(status);

		throw { status, message };
	}
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
