// Admin hooks (for admin dashboard)
export * from "./use-admin";
export * from "./use-admin-notifications";
export * from "./use-course-semesters";
export * from "./use-courses";
export * from "./use-department";
export * from "./use-enrollment-sessions";
export * from "./use-enrollments";
export * from "./use-exam-schedules";
export * from "./use-lecturer";
export * from "./use-posts";
export * from "./use-semesters";
export * from "./use-students";
export * from "./use-webhooks";

// Auth & User hooks
export * from "./use-auth";
export * from "./use-user-profile";

// Public data hooks (for any authenticated user)
export * from "./use-active-enrollment-sessions";
export * from "./use-documents";
export * from "./use-public-course-semesters";
export * from "./use-public-data";
export * from "./use-public-semesters";
export * from "./use-public-users";
// Note: use-notifications.ts handles user notifications for students/lecturers
export * from "./use-public-exam-schedules";
export * from "./use-public-posts";
export * from "./use-user-webhooks";

// Utility hooks
export * from "./use-delete-confirmation";
export * from "./use-form-persistence";
export * from "./use-keyboard-shortcut";

// Re-export mutation hooks from query
export {
  // Course mutations
  useCreateCourse,
  // Course Semester mutations
  useCreateCourseSemester,
  // Department mutations
  useCreateDepartment,
  // Document mutations (lecturer)
  useCreateDocument,
  // Enrollment Session mutations
  useCreateEnrollmentSession,
  useCreateEnrollmentSessions,
  // Exam Schedule mutations
  useCreateExamSchedule,
  useCreateExamSchedules,
  // Lecturer mutations
  useCreateLecturer,
  // Lecturer exam schedule mutations
  useCreateLecturerExamSchedule,
  // Lecturer webhook mutations
  useCreateLecturerWebhook,
  // Notification mutations
  useCreateNotification,
  // Post mutations
  useCreatePost,
  // Semester mutations
  useCreateSemester,
  // Student mutations
  useCreateStudent,
  // Student webhook mutations
  useCreateStudentWebhook,
  // Webhook mutations (admin)
  useCreateWebhook,
  useDeleteAllLecturerNotifications,
  useDeleteAllStudentNotifications,
  useDeleteCourse,
  useDeleteCourses,
  useDeleteCourseSemester,
  useDeleteCourseSemesters,
  useDeleteDepartment,
  useDeleteDepartments,
  useDeleteDocument,
  useDeleteEnrollmentSession,
  useDeleteEnrollmentSessions,
  useDeleteExamSchedule,
  useDeleteExamSchedules,
  useDeleteLecturer,
  useDeleteLecturerExamSchedule,
  // Lecturer notification mutations
  useDeleteLecturerNotification,
  useDeleteLecturers,
  useDeleteLecturerWebhook,
  useDeleteNotification,
  useDeletePost,
  useDeletePosts,
  useDeleteSemester,
  useDeleteSemesters,
  useDeleteStudent,
  // Student notification mutations
  useDeleteStudentNotification,
  useDeleteStudents,
  useDeleteStudentWebhook,
  useDeleteWebhook,
  useToggleLecturerWebhook,
  useToggleStudentWebhook,
  useToggleWebhook,
  useUpdateCourse,
  useUpdateCourseSemester,
  useUpdateDepartment,
  useUpdateDocument,
  useUpdateEnrollmentSession,
  useUpdateExamSchedule,
  useUpdateLecturer,
  useUpdateLecturerExamSchedule,
  useUpdateLecturerWebhook,
  useUpdateNotification,
  useUpdatePost,
  useUpdateSemester,
  useUpdateStudent,
  useUpdateStudentWebhook,
  useUpdateWebhook,
} from "@/lib/query/mutations";
