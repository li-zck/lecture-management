import { getErrorMessage } from "@/lib/api";
import { type ApiResponse, PATCH, PUT } from "@/lib/axios";
import type {
	UpdateDepartmentRequest,
	UpdateLecturerAccountRequest,
	UpdateStudentAccountRequest,
} from "@/lib/types/dto/api/admin/request/update";
import type {
	UpdateDepartmentResponse,
	UpdateLecturerAccountResponse,
	UpdateStudentAccountResponse,
} from "@/lib/types/dto/api/admin/response/update";
import { APIROUTES } from "@/lib/utils";

const patch = async <TRequest, TResponse>(
	route: string,
	data: TRequest,
): Promise<ApiResponse<TResponse>> => {
	try {
		const res = await PATCH<TResponse, TRequest>(route, data);

		return res;
	} catch (error: any) {
		const status = error.response.status || 500;
		const message = getErrorMessage(status);

		throw { status, message };
	}
};

const put = async <TRequest, TResponse>(
	route: string,
	data: TRequest,
): Promise<ApiResponse<TResponse>> => {
	try {
		const res = await PUT<TResponse, TRequest>(route, data);

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
