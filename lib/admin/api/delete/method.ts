import { apiClient } from "@/lib/api";
import { APIROUTES } from "@/lib/utils";

const del = async (route: string, data?: any) => {
  const res = await apiClient.delete(route, data);
  return res;
};

/*
 * Student single deletion by ID
 * */
export const deleteStudentById = (studentId: string) => {
	del(APIROUTES.admin.delete.student.each.replace(":id", studentId));
};

/*
 * Student multiple deletion by IDs
 * */
export const deleteMultipleStudents = (studentIds: string[]) => {
	del(APIROUTES.admin.delete.student.many, { ids: studentIds });
};

/*
 * Lecturer single deletion by ID
 * */
export const deleteLecturerById = (lecturerId: string) => {
	del(APIROUTES.admin.delete.lecturer.each.replace(":id", lecturerId));
};

/*
 * Lecturer multiple deletion by IDs
 * */
export const deleteMultipleLecturers = (lecturerIds: string[]) => {
	del(APIROUTES.admin.delete.lecturer.many, { ids: lecturerIds });
};

/*
 * Department single deletion by ID
 * */
export const deleteDepartmentById = (departmentId: string) => {
	del(APIROUTES.admin.delete.department.each.replace(":id", departmentId));
};

/*
 * Department multiple deletion by IDs
 * */
export const deleteMultipleDepartments = (departmentIds: string[]) => {
	del(APIROUTES.admin.delete.department.many, { ids: departmentIds });
};

/*
 * Admin single deletion by ID
 * */
export const deleteAdminById = (adminId: string) => {
	del(APIROUTES.admin.delete.admin.each.replace(":id", adminId));
};

/*
 * Admin multiple deletion by IDs
 * */
export const deleteMultipleAdmins = (adminIds: string[]) => {
	del(APIROUTES.admin.delete.admin.many, { ids: adminIds });
};
