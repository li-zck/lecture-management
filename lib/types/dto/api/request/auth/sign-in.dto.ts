export interface SignInAdminRequest {
	username: string;
	password: string;
}

export type SignInStudentRequest = SignInAdminRequest;

export type SignInLecturerRequest = SignInAdminRequest;
