export type SignInAdminRequest = {
	username: string;
	password: string;
};

export type SignInStudentRequest = {
	studentId: string;
	password: string;
};

export type SignInLecturerRequest = {
	lecturerId: string;
	password: string;
};
