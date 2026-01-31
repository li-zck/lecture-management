/**
 * Centralized query keys for TanStack Query
 *
 * This provides type-safe, consistent keys for caching and invalidation.
 * Using a factory pattern allows for easy key generation and filtering.
 *
 * @example
 * // Get all students
 * queryKey: queryKeys.students.all
 *
 * // Get single student
 * queryKey: queryKeys.students.detail(id)
 *
 * // Invalidate all student queries
 * queryClient.invalidateQueries({ queryKey: queryKeys.students.all })
 */

export const queryKeys = {
	// ==================== Admin Queries ====================
	admins: {
		all: ["admins"] as const,
		lists: () => [...queryKeys.admins.all, "list"] as const,
		list: (filters?: Record<string, unknown>) =>
			[...queryKeys.admins.lists(), filters] as const,
		details: () => [...queryKeys.admins.all, "detail"] as const,
		detail: (id: string) => [...queryKeys.admins.details(), id] as const,
	},

	students: {
		all: ["students"] as const,
		lists: () => [...queryKeys.students.all, "list"] as const,
		list: (filters?: Record<string, unknown>) =>
			[...queryKeys.students.lists(), filters] as const,
		details: () => [...queryKeys.students.all, "detail"] as const,
		detail: (id: string) => [...queryKeys.students.details(), id] as const,
	},

	lecturers: {
		all: ["lecturers"] as const,
		lists: () => [...queryKeys.lecturers.all, "list"] as const,
		list: (filters?: Record<string, unknown>) =>
			[...queryKeys.lecturers.lists(), filters] as const,
		details: () => [...queryKeys.lecturers.all, "detail"] as const,
		detail: (id: string) => [...queryKeys.lecturers.details(), id] as const,
	},

	departments: {
		all: ["departments"] as const,
		lists: () => [...queryKeys.departments.all, "list"] as const,
		list: (filters?: Record<string, unknown>) =>
			[...queryKeys.departments.lists(), filters] as const,
		details: () => [...queryKeys.departments.all, "detail"] as const,
		detail: (id: string) => [...queryKeys.departments.details(), id] as const,
	},

	courses: {
		all: ["courses"] as const,
		lists: () => [...queryKeys.courses.all, "list"] as const,
		list: (filters?: Record<string, unknown>) =>
			[...queryKeys.courses.lists(), filters] as const,
		details: () => [...queryKeys.courses.all, "detail"] as const,
		detail: (id: string) => [...queryKeys.courses.details(), id] as const,
		byDepartment: (departmentId: string) =>
			[...queryKeys.courses.all, "byDepartment", departmentId] as const,
	},

	semesters: {
		all: ["semesters"] as const,
		lists: () => [...queryKeys.semesters.all, "list"] as const,
		list: (filters?: Record<string, unknown>) =>
			[...queryKeys.semesters.lists(), filters] as const,
		details: () => [...queryKeys.semesters.all, "detail"] as const,
		detail: (id: string) => [...queryKeys.semesters.details(), id] as const,
	},

	courseSemesters: {
		all: ["course-semesters"] as const,
		lists: () => [...queryKeys.courseSemesters.all, "list"] as const,
		list: (filters?: Record<string, unknown>) =>
			[...queryKeys.courseSemesters.lists(), filters] as const,
		details: () => [...queryKeys.courseSemesters.all, "detail"] as const,
		detail: (id: string) =>
			[...queryKeys.courseSemesters.details(), id] as const,
	},

	enrollmentSessions: {
		all: ["enrollment-sessions"] as const,
		lists: () => [...queryKeys.enrollmentSessions.all, "list"] as const,
		list: (filters?: Record<string, unknown>) =>
			[...queryKeys.enrollmentSessions.lists(), filters] as const,
		details: () => [...queryKeys.enrollmentSessions.all, "detail"] as const,
		detail: (id: string) =>
			[...queryKeys.enrollmentSessions.details(), id] as const,
		bySemester: (semesterId: string) =>
			[...queryKeys.enrollmentSessions.all, "bySemester", semesterId] as const,
	},

	notifications: {
		all: ["notifications"] as const,
		lists: () => [...queryKeys.notifications.all, "list"] as const,
		list: (filters?: Record<string, unknown>) =>
			[...queryKeys.notifications.lists(), filters] as const,
		details: () => [...queryKeys.notifications.all, "detail"] as const,
		detail: (id: string) => [...queryKeys.notifications.details(), id] as const,
		byUser: (params: { studentId?: string; lecturerId?: string }) =>
			[...queryKeys.notifications.all, "byUser", params] as const,
	},

	posts: {
		all: ["posts"] as const,
		lists: () => [...queryKeys.posts.all, "list"] as const,
		list: (filters?: Record<string, unknown>) =>
			[...queryKeys.posts.lists(), filters] as const,
		details: () => [...queryKeys.posts.all, "detail"] as const,
		detail: (id: string) => [...queryKeys.posts.details(), id] as const,
		byDepartment: (departmentId: string) =>
			[...queryKeys.posts.all, "byDepartment", departmentId] as const,
		global: () => [...queryKeys.posts.all, "global"] as const,
	},

	examSchedules: {
		all: ["exam-schedules"] as const,
		lists: () => [...queryKeys.examSchedules.all, "list"] as const,
		list: (filters?: Record<string, unknown>) =>
			[...queryKeys.examSchedules.lists(), filters] as const,
		details: () => [...queryKeys.examSchedules.all, "detail"] as const,
		detail: (id: string) => [...queryKeys.examSchedules.details(), id] as const,
	},

	webhooks: {
		all: ["webhooks"] as const,
		lists: () => [...queryKeys.webhooks.all, "list"] as const,
		list: (filters?: Record<string, unknown>) =>
			[...queryKeys.webhooks.lists(), filters] as const,
		details: () => [...queryKeys.webhooks.all, "detail"] as const,
		detail: (id: string) => [...queryKeys.webhooks.details(), id] as const,
		byUser: (params: { studentId?: string; lecturerId?: string }) =>
			[...queryKeys.webhooks.all, "byUser", params] as const,
	},

	// ==================== User Profile ====================
	userProfile: {
		all: ["user-profile"] as const,
		student: (id: string) =>
			[...queryKeys.userProfile.all, "student", id] as const,
		lecturer: (id: string) =>
			[...queryKeys.userProfile.all, "lecturer", id] as const,
	},

	// ==================== Enrollments ====================
	enrollments: {
		all: ["enrollments"] as const,
		student: () => [...queryKeys.enrollments.all, "student"] as const,
		byCourse: (courseId: string) =>
			[...queryKeys.enrollments.all, "course", courseId] as const,
	},

	// ==================== Public User Lists ====================
	publicStudents: {
		all: ["public-students"] as const,
		lists: () => [...queryKeys.publicStudents.all, "list"] as const,
		details: () => [...queryKeys.publicStudents.all, "detail"] as const,
		detail: (id: string) =>
			[...queryKeys.publicStudents.details(), id] as const,
	},

	publicLecturers: {
		all: ["public-lecturers"] as const,
		lists: () => [...queryKeys.publicLecturers.all, "list"] as const,
		details: () => [...queryKeys.publicLecturers.all, "detail"] as const,
		detail: (id: string) =>
			[...queryKeys.publicLecturers.details(), id] as const,
	},

	// ==================== Public Enrollment Sessions ====================
	activeEnrollmentSessions: {
		all: ["active-enrollment-sessions"] as const,
		lists: () => [...queryKeys.activeEnrollmentSessions.all, "list"] as const,
		details: () =>
			[...queryKeys.activeEnrollmentSessions.all, "detail"] as const,
		detail: (id: string) =>
			[...queryKeys.activeEnrollmentSessions.details(), id] as const,
		bySemester: (semesterId: string) =>
			[
				...queryKeys.activeEnrollmentSessions.all,
				"bySemester",
				semesterId,
			] as const,
	},

	// ==================== Public Semesters ====================
	publicSemesters: {
		all: ["public-semesters"] as const,
		lists: () => [...queryKeys.publicSemesters.all, "list"] as const,
		details: () => [...queryKeys.publicSemesters.all, "detail"] as const,
		detail: (id: string) =>
			[...queryKeys.publicSemesters.details(), id] as const,
	},

	// ==================== Public Course-Semesters ====================
	publicCourseSemesters: {
		all: ["public-course-semesters"] as const,
		lists: () => [...queryKeys.publicCourseSemesters.all, "list"] as const,
		list: (filters?: { courseId?: string; semesterId?: string }) =>
			[...queryKeys.publicCourseSemesters.lists(), filters] as const,
		details: () => [...queryKeys.publicCourseSemesters.all, "detail"] as const,
		detail: (id: string) =>
			[...queryKeys.publicCourseSemesters.details(), id] as const,
	},

	// ==================== Documents ====================
	documents: {
		all: ["documents"] as const,
		lists: () => [...queryKeys.documents.all, "list"] as const,
		details: () => [...queryKeys.documents.all, "detail"] as const,
		detail: (id: string) => [...queryKeys.documents.details(), id] as const,
	},

	// ==================== Student Notifications ====================
	studentNotifications: {
		all: ["student-notifications"] as const,
		lists: () => [...queryKeys.studentNotifications.all, "list"] as const,
		details: () => [...queryKeys.studentNotifications.all, "detail"] as const,
		detail: (id: string) =>
			[...queryKeys.studentNotifications.details(), id] as const,
	},

	// ==================== Lecturer Notifications ====================
	lecturerNotifications: {
		all: ["lecturer-notifications"] as const,
		lists: () => [...queryKeys.lecturerNotifications.all, "list"] as const,
		details: () => [...queryKeys.lecturerNotifications.all, "detail"] as const,
		detail: (id: string) =>
			[...queryKeys.lecturerNotifications.details(), id] as const,
	},

	// ==================== Student Webhooks ====================
	studentWebhooks: {
		all: ["student-webhooks"] as const,
		lists: () => [...queryKeys.studentWebhooks.all, "list"] as const,
		details: () => [...queryKeys.studentWebhooks.all, "detail"] as const,
		detail: (id: string) =>
			[...queryKeys.studentWebhooks.details(), id] as const,
	},

	// ==================== Lecturer Webhooks ====================
	lecturerWebhooks: {
		all: ["lecturer-webhooks"] as const,
		lists: () => [...queryKeys.lecturerWebhooks.all, "list"] as const,
		details: () => [...queryKeys.lecturerWebhooks.all, "detail"] as const,
		detail: (id: string) =>
			[...queryKeys.lecturerWebhooks.details(), id] as const,
	},

	// ==================== Public Posts ====================
	publicPosts: {
		all: ["public-posts"] as const,
		global: () => [...queryKeys.publicPosts.all, "global"] as const,
		byDepartment: (departmentId: string) =>
			[...queryKeys.publicPosts.all, "byDepartment", departmentId] as const,
		details: () => [...queryKeys.publicPosts.all, "detail"] as const,
		detail: (id: string) => [...queryKeys.publicPosts.details(), id] as const,
	},

	// ==================== Public Exam Schedules ====================
	publicExamSchedules: {
		all: ["public-exam-schedules"] as const,
		lists: () => [...queryKeys.publicExamSchedules.all, "list"] as const,
		details: () => [...queryKeys.publicExamSchedules.all, "detail"] as const,
		detail: (id: string) =>
			[...queryKeys.publicExamSchedules.details(), id] as const,
	},

	// ==================== Student Exam Schedules ====================
	studentExamSchedules: {
		all: ["student-exam-schedules"] as const,
		mySchedules: (semesterId?: string) =>
			[...queryKeys.studentExamSchedules.all, "my", semesterId] as const,
	},

	// ==================== Lecturer Exam Schedules ====================
	lecturerExamSchedules: {
		all: ["lecturer-exam-schedules"] as const,
		myCourses: () =>
			[...queryKeys.lecturerExamSchedules.all, "my-courses"] as const,
	},
} as const;

// Type for queryKeys
export type QueryKeys = typeof queryKeys;
