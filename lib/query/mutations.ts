/**
 * TanStack Query mutation hooks for CRUD operations
 *
 * These hooks provide automatic cache invalidation after mutations,
 * optimistic updates support, and consistent error handling.
 */

import { getClientDictionary } from "@/lib/i18n";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "./keys";

// Import all admin APIs
import {
  adminCourseApi,
  type CreateCourseRequest,
  type UpdateCourseRequest,
} from "@/lib/api/admin-course";
import {
  adminCourseSemesterApi,
  type CreateCourseSemesterRequest,
  type UpdateCourseSemesterRequest,
} from "@/lib/api/admin-course-semester";
import {
  adminDepartmentApi,
  type CreateDepartmentRequest,
  type UpdateDepartmentRequest,
} from "@/lib/api/admin-department";
import {
  adminEnrollmentSessionApi,
  type CreateEnrollmentSessionRequest,
  type UpdateEnrollmentSessionRequest,
} from "@/lib/api/admin-enrollment-session";
import {
  adminExamScheduleApi,
  type CreateExamScheduleRequest,
  type UpdateExamScheduleRequest,
} from "@/lib/api/admin-exam-schedule";
import {
  adminLecturerApi,
  type CreateLecturerRequest,
  type UpdateLecturerRequest,
} from "@/lib/api/admin-lecturer";
import {
  adminNotificationApi,
  type CreateNotificationRequest,
  type UpdateNotificationRequest,
} from "@/lib/api/admin-notification";
import {
  adminPostApi,
  type CreatePostRequest,
  type UpdatePostRequest,
} from "@/lib/api/admin-post";
import {
  adminSemesterApi,
  type CreateSemesterRequest,
  type UpdateSemesterRequest,
} from "@/lib/api/admin-semester";
import {
  adminStudentApi,
  type CreateStudentRequest,
  type UpdateStudentRequest,
} from "@/lib/api/admin-student";
import {
  adminWebhookApi,
  type CreateWebhookRequest,
  type UpdateWebhookRequest,
} from "@/lib/api/admin-webhook";

// ==================== Student Mutations ====================

export function useCreateStudent() {
  const queryClient = useQueryClient();
  const dict = getClientDictionary("en" as any);

  return useMutation({
    mutationFn: (data: CreateStudentRequest) => adminStudentApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all });
      toast.success(
        dict.admin.common.createdSuccess.replace("{entity}", "student"),
      );
    },
    onError: (error: Error) => {
      toast.error(
        error.message ||
          dict.admin.common.createFailed.replace("{entity}", "student"),
      );
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentRequest }) =>
      adminStudentApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.students.detail(variables.id),
      });
      toast.success("Student updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update student");
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminStudentApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all });
      toast.success("Student deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete student");
    },
  });
}

export function useDeleteStudents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => adminStudentApi.deleteMultiple(ids),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all });
      toast.success(`${data.deleted} student(s) deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete students");
    },
  });
}

// ==================== Lecturer Mutations ====================

export function useCreateLecturer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLecturerRequest) => adminLecturerApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lecturers.all });
      toast.success("Lecturer created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create lecturer");
    },
  });
}

export function useUpdateLecturer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLecturerRequest }) =>
      adminLecturerApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lecturers.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.lecturers.detail(variables.id),
      });
      toast.success("Lecturer updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update lecturer");
    },
  });
}

export function useDeleteLecturer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminLecturerApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lecturers.all });
      toast.success("Lecturer deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete lecturer");
    },
  });
}

export function useDeleteLecturers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => adminLecturerApi.deleteMultiple(ids),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lecturers.all });
      toast.success(`${data.deleted} lecturer(s) deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete lecturers");
    },
  });
}

// ==================== Department Mutations ====================

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDepartmentRequest) =>
      adminDepartmentApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.all });
      toast.success("Department created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create department");
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDepartmentRequest }) =>
      adminDepartmentApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.departments.detail(variables.id),
      });
      toast.success("Department updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update department");
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminDepartmentApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.all });
      toast.success("Department deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete department");
    },
  });
}

export function useDeleteDepartments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => adminDepartmentApi.deleteMultiple(ids),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.all });
      toast.success(`${data.deleted} department(s) deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete departments");
    },
  });
}

// ==================== Course Mutations ====================

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseRequest) => adminCourseApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
      toast.success("Course created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create course");
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseRequest }) =>
      adminCourseApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.detail(variables.id),
      });
      toast.success("Course updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update course");
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminCourseApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
      toast.success("Course deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete course");
    },
  });
}

export function useDeleteCourses() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => adminCourseApi.deleteMultiple(ids),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
      toast.success(`${data.deleted} course(s) deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete courses");
    },
  });
}

// ==================== Semester Mutations ====================

export function useCreateSemester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSemesterRequest) => adminSemesterApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.semesters.all });
      toast.success("Semester created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create semester");
    },
  });
}

export function useUpdateSemester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSemesterRequest }) =>
      adminSemesterApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.semesters.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.semesters.detail(variables.id),
      });
      toast.success("Semester updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update semester");
    },
  });
}

export function useDeleteSemester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminSemesterApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.semesters.all });
      toast.success("Semester deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete semester");
    },
  });
}

export function useDeleteSemesters() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => adminSemesterApi.deleteMultiple(ids),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.semesters.all });
      toast.success(`${data.deleted} semester(s) deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete semesters");
    },
  });
}

// ==================== Course Semester Mutations ====================

export function useCreateCourseSemester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseSemesterRequest) =>
      adminCourseSemesterApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.courseSemesters.all,
      });
      toast.success("Course offering created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create course offering");
    },
  });
}

export function useUpdateCourseSemester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCourseSemesterRequest;
    }) => adminCourseSemesterApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.courseSemesters.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.courseSemesters.detail(variables.id),
      });
      toast.success("Course offering updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update course offering");
    },
  });
}

export function useDeleteCourseSemester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminCourseSemesterApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.courseSemesters.all,
      });
      toast.success("Course offering deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete course offering");
    },
  });
}

export function useDeleteCourseSemesters() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => adminCourseSemesterApi.deleteMultiple(ids),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.courseSemesters.all,
      });
      toast.success(`${data.deleted} course offering(s) deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete course offerings");
    },
  });
}

// ==================== Enrollment Session Mutations ====================

export function useCreateEnrollmentSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEnrollmentSessionRequest) =>
      adminEnrollmentSessionApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.enrollmentSessions.all,
      });
      toast.success("Enrollment session created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create enrollment session");
    },
  });
}

export function useCreateEnrollmentSessions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessions: CreateEnrollmentSessionRequest[]) =>
      adminEnrollmentSessionApi.createMultiple(sessions),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.enrollmentSessions.all,
      });
      toast.success(
        `${data.created} enrollment session(s) created successfully`,
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create enrollment sessions");
    },
  });
}

export function useUpdateEnrollmentSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateEnrollmentSessionRequest;
    }) => adminEnrollmentSessionApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.enrollmentSessions.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.enrollmentSessions.detail(variables.id),
      });
      toast.success("Enrollment session updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update enrollment session");
    },
  });
}

export function useDeleteEnrollmentSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminEnrollmentSessionApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.enrollmentSessions.all,
      });
      toast.success("Enrollment session deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete enrollment session");
    },
  });
}

export function useDeleteEnrollmentSessions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) =>
      adminEnrollmentSessionApi.deleteMultiple(ids),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.enrollmentSessions.all,
      });
      toast.success(
        `${data.deleted} enrollment session(s) deleted successfully`,
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete enrollment sessions");
    },
  });
}

// ==================== Notification Mutations ====================

export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNotificationRequest) =>
      adminNotificationApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all,
      });
      toast.success("Notification created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create notification");
    },
  });
}

export function useUpdateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateNotificationRequest;
    }) => adminNotificationApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.detail(variables.id),
      });
      toast.success("Notification updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update notification");
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminNotificationApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all,
      });
      toast.success("Notification deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete notification");
    },
  });
}

// ==================== Post Mutations ====================

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostRequest) => adminPostApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      toast.success("Post created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create post");
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePostRequest }) =>
      adminPostApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.detail(variables.id),
      });
      toast.success("Post updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update post");
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminPostApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      toast.success("Post deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete post");
    },
  });
}

export function useDeletePosts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => adminPostApi.deleteMultiple(ids),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      toast.success(`${data.deleted} post(s) deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete posts");
    },
  });
}

// ==================== Exam Schedule Mutations ====================

export function useCreateExamSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExamScheduleRequest) =>
      adminExamScheduleApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.examSchedules.all });
      toast.success("Exam schedule created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create exam schedule");
    },
  });
}

export function useCreateExamSchedules() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (examSchedules: CreateExamScheduleRequest[]) =>
      adminExamScheduleApi.createMultiple(examSchedules),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.examSchedules.all });
      toast.success(`${data.created} exam schedule(s) created successfully`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create exam schedules");
    },
  });
}

export function useUpdateExamSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateExamScheduleRequest;
    }) => adminExamScheduleApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.examSchedules.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.examSchedules.detail(variables.id),
      });
      toast.success("Exam schedule updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update exam schedule");
    },
  });
}

export function useDeleteExamSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminExamScheduleApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.examSchedules.all });
      toast.success("Exam schedule deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete exam schedule");
    },
  });
}

export function useDeleteExamSchedules() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => adminExamScheduleApi.deleteMultiple(ids),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.examSchedules.all });
      toast.success(`${data.deleted} exam schedule(s) deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete exam schedules");
    },
  });
}

// ==================== Webhook Mutations ====================

export function useCreateWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWebhookRequest) => adminWebhookApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.webhooks.all });
      toast.success("Webhook created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create webhook");
    },
  });
}

export function useUpdateWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWebhookRequest }) =>
      adminWebhookApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.webhooks.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.webhooks.detail(variables.id),
      });
      toast.success("Webhook updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update webhook");
    },
  });
}

export function useToggleWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminWebhookApi.toggle(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.webhooks.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.webhooks.detail(id),
      });
      toast.success("Webhook status toggled successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to toggle webhook");
    },
  });
}

export function useDeleteWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminWebhookApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.webhooks.all });
      toast.success("Webhook deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete webhook");
    },
  });
}

// ==================== Document Mutations (Lecturer) ====================

import {
  documentApi,
  type CreateDocumentRequest,
  type UpdateDocumentRequest,
} from "@/lib/api/document";

export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, file }: { data: CreateDocumentRequest; file: File }) =>
      documentApi.create(data, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.all });
      toast.success("Document created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create document");
    },
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
      file,
    }: {
      id: string;
      data: UpdateDocumentRequest;
      file?: File;
    }) => documentApi.update(id, data, file),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.documents.detail(variables.id),
      });
      toast.success("Document updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update document");
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => documentApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.all });
      toast.success("Document deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete document");
    },
  });
}

// ==================== Student Notification Mutations ====================

import { studentNotificationApi } from "@/lib/api/user-notification";

export function useDeleteStudentNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => studentNotificationApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.studentNotifications.all,
      });
      toast.success("Notification deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete notification");
    },
  });
}

export function useDeleteAllStudentNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => studentNotificationApi.deleteAll(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.studentNotifications.all,
      });
      toast.success(`${data.count} notification(s) deleted`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete notifications");
    },
  });
}

// ==================== Lecturer Notification Mutations ====================

import { lecturerNotificationApi } from "@/lib/api/user-notification";

export function useDeleteLecturerNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => lecturerNotificationApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lecturerNotifications.all,
      });
      toast.success("Notification deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete notification");
    },
  });
}

export function useDeleteAllLecturerNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => lecturerNotificationApi.deleteAll(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lecturerNotifications.all,
      });
      toast.success(`${data.count} notification(s) deleted`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete notifications");
    },
  });
}

// ==================== Student Webhook Mutations ====================

import {
  studentWebhookApi,
  type CreateUserWebhookRequest,
  type UpdateUserWebhookRequest,
} from "@/lib/api/user-webhook";

export function useCreateStudentWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserWebhookRequest) =>
      studentWebhookApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.studentWebhooks.all,
      });
      toast.success("Webhook created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create webhook");
    },
  });
}

export function useUpdateStudentWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateUserWebhookRequest;
    }) => studentWebhookApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.studentWebhooks.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.studentWebhooks.detail(variables.id),
      });
      toast.success("Webhook updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update webhook");
    },
  });
}

export function useToggleStudentWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => studentWebhookApi.toggle(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.studentWebhooks.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.studentWebhooks.detail(id),
      });
      toast.success("Webhook status toggled");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to toggle webhook");
    },
  });
}

export function useDeleteStudentWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => studentWebhookApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.studentWebhooks.all,
      });
      toast.success("Webhook deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete webhook");
    },
  });
}

// ==================== Lecturer Webhook Mutations ====================

import { lecturerWebhookApi } from "@/lib/api/user-webhook";

export function useCreateLecturerWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserWebhookRequest) =>
      lecturerWebhookApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lecturerWebhooks.all,
      });
      toast.success("Webhook created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create webhook");
    },
  });
}

export function useUpdateLecturerWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateUserWebhookRequest;
    }) => lecturerWebhookApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lecturerWebhooks.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.lecturerWebhooks.detail(variables.id),
      });
      toast.success("Webhook updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update webhook");
    },
  });
}

export function useToggleLecturerWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => lecturerWebhookApi.toggle(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lecturerWebhooks.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.lecturerWebhooks.detail(id),
      });
      toast.success("Webhook status toggled");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to toggle webhook");
    },
  });
}

export function useDeleteLecturerWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => lecturerWebhookApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lecturerWebhooks.all,
      });
      toast.success("Webhook deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete webhook");
    },
  });
}

// ==================== Lecturer Exam Schedule Mutations ====================

import {
  lecturerExamScheduleApi,
  type CreateExamScheduleRequest as CreateLecturerExamScheduleRequest,
  type UpdateExamScheduleRequest as UpdateLecturerExamScheduleRequest,
} from "@/lib/api/exam-schedule";

export function useCreateLecturerExamSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLecturerExamScheduleRequest) =>
      lecturerExamScheduleApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lecturerExamSchedules.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.publicExamSchedules.all,
      });
      toast.success("Exam schedule created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create exam schedule");
    },
  });
}

export function useUpdateLecturerExamSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateLecturerExamScheduleRequest;
    }) => lecturerExamScheduleApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lecturerExamSchedules.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.publicExamSchedules.all,
      });
      toast.success("Exam schedule updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update exam schedule");
    },
  });
}

export function useDeleteLecturerExamSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => lecturerExamScheduleApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lecturerExamSchedules.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.publicExamSchedules.all,
      });
      toast.success("Exam schedule deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete exam schedule");
    },
  });
}
