// Core client
export * from "./client";

// Utilities
export * from "./error";
export * from "./success";

// Authentication
export * from "./auth";

// Admin APIs
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
// Note: Only export the API objects, not types (to avoid conflicts with admin types)
export { courseApi } from "./course";
export { departmentApi } from "./department";

// Public user list APIs
export * from "./public-student";
export * from "./public-lecturer";

// Public enrollment session API
export * from "./enrollment-session";

// Public semester APIs
export * from "./semester";
export * from "./course-semester";

// Document API
export * from "./document";

// User notification APIs (student/lecturer)
export * from "./user-notification";

// User webhook APIs (student/lecturer)
export * from "./user-webhook";

// Public post API
export * from "./post";

// Public exam schedule APIs
export * from "./exam-schedule";
