import { getErrorMessage } from "@/lib/api";
import { DEL } from "@/lib/axios";
import { APIROUTES } from "@/lib/utils";

const del = async (route: string, data?: any) => {
	try {
		const res = await DEL(route, data);

		return res;
	} catch (error: any) {
		const status = error.response?.status || 500;
		const message = getErrorMessage(status);

		throw { error, message };
	}
};

/*
 * Student methods
 * */
export const deleteStudentById = (studentId: string) => {
	del(APIROUTES.admin.delete.student.each.replace(":id", studentId));
};

export const deleteMultipleStudents = (studentIds: string[]) => {
	del(APIROUTES.admin.delete.student.many, { ids: studentIds });
};

/*
 * Lecturer methods
 * */
export const deleteLecturerById = (lecturerId: string) => {
	del(APIROUTES.admin.delete.lecturer.each.replace(":id", lecturerId));
};

export const deleteMultipleLecturers = (lecturerIds: string[]) => {
	del(APIROUTES.admin.delete.lecturer.many, { ids: lecturerIds });
};

/*
 * Department methods
 * */
export const deleteDepartmentById = (departmentId: string) => {
	del(APIROUTES.admin.delete.department.each.replace(":id", departmentId));
};

export const deleteMultipleDepartments = (departmentIds: string[]) => {
	del(APIROUTES.admin.delete.department.many, { ids: departmentIds });
};
