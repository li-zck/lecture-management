export interface SignUpAdminRequest {
	username: string;
	password: string;
	confirmPassword: string;
}

export type SignUpStudentRequest = SignUpAdminRequest;

export type SignUpLecturerRequest = SignUpAdminRequest;
