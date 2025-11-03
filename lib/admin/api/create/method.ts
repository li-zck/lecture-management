import { getErrorMessage } from "@/lib/api";
import { type ApiResponse, POST } from "@/lib/axios";
import type {
	CreateDepartmentRequest,
	CreateLecturerAccountRequest,
	CreateStudentAccountRequest,
} from "@/lib/types/dto/api/admin/request/create/create.dto";
import type {
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

/*
 * lecturer methods
 */
export const createLecturerAccount = (data: CreateLecturerAccountRequest) => {
	const validatedata = createLecturerSchema.parse(data);

	postCreate<CreateLecturerAccountRequest, CreateLecturerAccountResponse>(
		APIROUTES.admin.create.lecturer.each,
		validatedata,
	);
};

/*
 * department methods
 */
export const createDepartment = (data: CreateDepartmentRequest) =>
	postCreate<CreateDepartmentRequest, CreateDepartmentResponse>(
		APIROUTES.admin.create.department.each,
		data,
	);
