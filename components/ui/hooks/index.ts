// Admin hooks (for admin dashboard)
export * from "./use-admin";
export * from "./use-department";
export * from "./use-lecturer";
export * from "./use-students";
export * from "./use-courses";
export * from "./use-semesters";
export * from "./use-course-semesters";
export * from "./use-enrollment-sessions";
export * from "./use-notifications";
export * from "./use-posts";
export * from "./use-exam-schedules";
export * from "./use-webhooks";

// Auth & User hooks
export * from "./use-auth";
export * from "./use-user-profile";

// Public data hooks (for any authenticated user)
export * from "./use-public-data";
export * from "./use-public-users";
export * from "./use-active-enrollment-sessions";
export * from "./use-public-semesters";
export * from "./use-public-course-semesters";
export * from "./use-documents";
export * from "./use-user-notifications";
export * from "./use-user-webhooks";
export * from "./use-public-posts";
export * from "./use-public-exam-schedules";

// Utility hooks
export * from "./use-form-persistence";
export * from "./use-keyboard-shortcut";
export * from "./use-delete-confirmation";

// Re-export mutation hooks from query
export {
	// Student mutations
	useCreateStudent,
	useUpdateStudent,
	useDeleteStudent,
	useDeleteStudents,
	// Lecturer mutations
	useCreateLecturer,
	useUpdateLecturer,
	useDeleteLecturer,
	useDeleteLecturers,
	// Department mutations
	useCreateDepartment,
	useUpdateDepartment,
	useDeleteDepartment,
	useDeleteDepartments,
	// Course mutations
	useCreateCourse,
	useUpdateCourse,
	useDeleteCourse,
	useDeleteCourses,
	// Semester mutations
	useCreateSemester,
	useUpdateSemester,
	useDeleteSemester,
	useDeleteSemesters,
	// Course Semester mutations
	useCreateCourseSemester,
	useUpdateCourseSemester,
	useDeleteCourseSemester,
	useDeleteCourseSemesters,
	// Enrollment Session mutations
	useCreateEnrollmentSession,
	useCreateEnrollmentSessions,
	useUpdateEnrollmentSession,
	useDeleteEnrollmentSession,
	useDeleteEnrollmentSessions,
	// Notification mutations
	useCreateNotification,
	useUpdateNotification,
	useDeleteNotification,
	// Post mutations
	useCreatePost,
	useUpdatePost,
	useDeletePost,
	useDeletePosts,
	// Exam Schedule mutations
	useCreateExamSchedule,
	useCreateExamSchedules,
	useUpdateExamSchedule,
	useDeleteExamSchedule,
	useDeleteExamSchedules,
	// Webhook mutations (admin)
	useCreateWebhook,
	useUpdateWebhook,
	useToggleWebhook,
	useDeleteWebhook,
	// Document mutations (lecturer)
	useCreateDocument,
	useUpdateDocument,
	useDeleteDocument,
	// Student notification mutations
	useDeleteStudentNotification,
	useDeleteAllStudentNotifications,
	// Lecturer notification mutations
	useDeleteLecturerNotification,
	useDeleteAllLecturerNotifications,
	// Student webhook mutations
	useCreateStudentWebhook,
	useUpdateStudentWebhook,
	useToggleStudentWebhook,
	useDeleteStudentWebhook,
	// Lecturer webhook mutations
	useCreateLecturerWebhook,
	useUpdateLecturerWebhook,
	useToggleLecturerWebhook,
	useDeleteLecturerWebhook,
	// Lecturer exam schedule mutations
	useCreateLecturerExamSchedule,
	useUpdateLecturerExamSchedule,
	useDeleteLecturerExamSchedule,
} from "@/lib/query/mutations";
