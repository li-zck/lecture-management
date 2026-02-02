// Core client
export * from "./client";

// Utilities
export * from "./error";
export * from "./success";

// Authentication
export * from "./auth";

// Admin APIs (primary type definitions)
export * from "./admin";
export * from "./admin-student";
export * from "./admin-lecturer";
export * from "./admin-department";
export * from "./admin-course";
export * from "./admin-enrollment";
export * from "./admin-semester";
export * from "./admin-course-semester";
export * from "./admin-enrollment-session";
export * from "./admin-notification";
export * from "./admin-post";
export * from "./admin-exam-schedule";
export * from "./admin-webhook";

// User role APIs
export * from "./student";
export * from "./lecturer";

// Public APIs (for any authenticated user)
// Only export API objects to avoid type conflicts with admin types
export { courseApi } from "./course";
export { departmentApi } from "./department";

// Public user list APIs
export * from "./public-student";
export * from "./public-lecturer";

// Public enrollment session API - only export the API object
export { enrollmentSessionApi } from "./enrollment-session";

// Public semester APIs - only export API objects and unique types
export {
	semesterApi,
	type CourseOnSemesterBasic,
	type SemesterQueryParams,
} from "./semester";
export {
	courseSemesterApi,
	type CourseSemesterQueryParams,
} from "./course-semester";
// Re-export CourseSemester from course-semester (it has additional fields)
export type { CourseSemester } from "./course-semester";

// Document API - only export API object and unique types
export {
	documentApi,
	type CreateDocumentRequest,
	type UpdateDocumentRequest,
} from "./document";

// User notification APIs - only export API objects and unique types
export {
	studentNotificationApi,
	lecturerNotificationApi,
	type UserNotification,
} from "./user-notification";

// User webhook APIs
export * from "./user-webhook";

// Public post API - only export API object and unique types
export { postApi, type PublicPost } from "./post";

// Public exam schedule APIs - only export API objects and unique types
export {
	examScheduleApi,
	studentExamScheduleApi,
	lecturerExamScheduleApi,
	type PublicExamSchedule,
} from "./exam-schedule";
