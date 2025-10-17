import { getErrorMessage } from "@/lib/api";
import { ApiResponse, PATCH } from "@/lib/axios";
import {
	UpdateStudentAccountRequest,
	UpdateLecturerAccountRequest,
	UpdateDepartmentRequest,
} from "@/lib/types/dto/api/admin/request/update";
import {
	UpdateStudentAccountResponse,
	UpdateLecturerAccountResponse,
	UpdateDepartmentResponse,
} from "@/lib/types/dto/api/admin/response/update";
import { APIROUTES } from "@/lib/utils";

const postUpdate = async <TRequest, TResponse>(
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

/*
 * student methods
 */
export const updateStudentAccount = (data: UpdateStudentAccountRequest) =>
	postUpdate<UpdateStudentAccountRequest, UpdateStudentAccountResponse>(
		APIROUTES.admin.update.student.each,
		data,
	);

/*
 * lecturer methods
 */
export const updateLecturerAccount = (data: UpdateLecturerAccountRequest) =>
	postUpdate<UpdateLecturerAccountRequest, UpdateLecturerAccountResponse>(
		APIROUTES.admin.update.lecturer.each,
		data,
	);

/*
 * department methods
 */
export const updateDepartment = (data: UpdateDepartmentRequest) =>
	postUpdate<UpdateDepartmentRequest, UpdateDepartmentResponse>(
		APIROUTES.admin.update.department.each,
		data,
	);
