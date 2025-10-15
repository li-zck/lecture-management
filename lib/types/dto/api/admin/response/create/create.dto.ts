export type CreateStudentAccountResponse = {
	id: string;
	studentId: string;
	departmentId: string;
	username: string;
	email: string;
	fullName: string;
	gender: string;
	birthDate: string;
	citizenId: string;
	phone: string;
	address: string;
	active: boolean;
	createdAt: string;
};

export type CreateLecturerAccountResponse = {
	id: string;
	email: string;
	username: string;
	fullName: string;
	active: boolean;
	createdAt: string;
};

export type CreateDepartmentResponse = {
	id: string;
	name: string;
	description?: string;
	headId?: string;
	createdAt: string;
};
