export type SignInAdminRequest = {
  username: string;
  password: string;
};

/**
 * Student sign-in request - either studentId OR username must be provided
 */
export type SignInStudentRequest = {
  studentId?: string;
  username?: string;
  password: string;
};

/**
 * Lecturer sign-in request - either lecturerId OR username must be provided
 */
export type SignInLecturerRequest = {
  lecturerId?: string;
  username?: string;
  password: string;
};

/**
 * Internal form data structure for sign-in forms
 * This is used by the form and transformed before sending to API
 */
export type SignInFormData = {
  identifier: string;
  loginMethod: "username" | "studentId" | "lecturerId";
  password: string;
};

