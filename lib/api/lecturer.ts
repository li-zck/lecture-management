import { apiClient } from "./client";

/** Raw item from GET /course-semester/lecturer/my-courses */
interface MyCoursesResponseItem {
  id: string;
  course: {
    id: string;
    name: string;
    credits: number;
    department?: { id: string; name: string } | null;
  };
  semester: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
  };
  dayOfWeek: number | null;
  startTime: number | null;
  endTime: number | null;
  location: string | null;
  mode?: "ONLINE" | "ON_CAMPUS" | "HYBRID";
  meetingUrl?: string | null;
  capacity: number | null;
  _count?: { enrollments: number };
}

function mapToAssignedCourse(row: MyCoursesResponseItem): AssignedCourse {
  return {
    courseOnSemesterId: row.id,
    course: {
      id: row.course.id,
      name: row.course.name,
      credits: row.course.credits,
      department: row.course.department?.name ?? null,
    },
    semester: {
      id: row.semester.id,
      name: row.semester.name,
      startDate: row.semester.startDate,
      endDate: row.semester.endDate,
    },
    schedule: {
      dayOfWeek: row.dayOfWeek ?? null,
      startTime: row.startTime ?? null,
      endTime: row.endTime ?? null,
      location: row.location ?? null,
      mode: row.mode,
      meetingUrl: row.meetingUrl,
    },
    enrolledCount: row._count?.enrollments ?? 0,
    capacity: row.capacity ?? null,
  };
}

export interface LecturerProfile {
  id: string;
  email: string;
  username: string;
  lecturerId: string;
  fullName: string | null;
  active: boolean;
  departmentHead: {
    id: string;
    name: string;
  } | null;
  gender?: boolean | null;
  birthDate?: string | null;
  citizenId?: string | null;
  phone?: string | null;
  address?: string | null;
}

export interface AssignedCourse {
  courseOnSemesterId: string;
  course: {
    id: string;
    name: string;
    credits: number;
    department: string | null;
  };
  semester: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
  };
  schedule: {
    dayOfWeek: number | null;
    startTime: number | null;
    endTime: number | null;
    location: string | null;
    mode?: "ONLINE" | "ON_CAMPUS" | "HYBRID";
    meetingUrl?: string | null;
  };
  enrolledCount: number;
  capacity: number | null;
}

export interface CourseStudent {
  enrollmentId: string;
  student: {
    id: string;
    studentId: string | null;
    fullName: string | null;
    email: string;
    avatar: string | null;
  };
  grades: {
    gradeType1: number | null;
    gradeType2: number | null;
    gradeType3: number | null;
    finalGrade: number | null;
  };
}

export interface LecturerTeachingRequestItem {
  id: string;
  lecturerId: string;
  courseOnSemesterId: string;
  status: string;
  createdAt: string;
  courseOnSemester: {
    id: string;
    course?: { id: string; name: string };
    semester?: { id: string; name: string; startDate: string; endDate: string };
  };
}

export interface UpdateGradeData {
  gradeType1?: number | null;
  gradeType2?: number | null;
  gradeType3?: number | null;
}

export interface CourseAnalytics {
  totalStudents: number;
  gradedCount: number;
  averageGrade: number | null;
  atRiskCount: number;
  distribution: Record<string, number>;
}

export interface LecturerStudentProfile {
  student: {
    id: string;
    studentId: string | null;
    fullName: string | null;
    email: string;
    phone: string | null;
    department: { id: string; name: string } | null;
  };
  enrollments: Array<{
    courseName: string;
    semester: string;
    credits: number;
    grades: {
      gradeType1: number | null;
      gradeType2: number | null;
      gradeType3: number | null;
      finalGrade: number | null;
    };
    schedule: {
      dayOfWeek: number | null;
      startTime: number | null;
      endTime: number | null;
      location: string | null;
    };
  }>;
}

export type LecturerSchedule = Record<
  number,
  Array<{
    courseName: string;
    startTime: number | null;
    endTime: number | null;
    location: string | null;
    lecturer: string | null;
    mode?: "ONLINE" | "ON_CAMPUS" | "HYBRID";
    meetingUrl?: string | null;
    courseOnSemesterId?: string;
  }>
>;

export const lecturerApi = {
  /**
   * Get lecturer profile by ID
   * Uses the /lecturer/:id endpoint with query parameter
   * @param id - Lecturer's internal ID (from access token)
   */
  getById: async (id: string): Promise<LecturerProfile> => {
    // Backend uses @Query('id') so we pass it as query parameter
    const response = await apiClient.get<LecturerProfile>(`/lecturer/${id}`, {
      params: { id },
    });
    return response.data;
  },

  /**
   * Update own profile (authenticated lecturer)
   * Uses @GetUser() decorator on backend - no ID needed
   * Matches backend LecturerUpdateAccountDto
   */
  updateProfile: async (data: {
    username?: string;
    fullName?: string;
    oldPassword?: string;
    password?: string;
  }): Promise<LecturerProfile> => {
    const response = await apiClient.patch<LecturerProfile, typeof data>(
      "/lecturer/update",
      data,
    );
    return response.data;
  },

  /**
   * Get course-semesters assigned to the current lecturer (My Courses).
   * Uses GET /course-semester/lecturer/my-courses. Only returns courses where
   * the lecturer is explicitly assigned (course-semester.lecturerId), not by
   * department head role.
   */
  getCourses: async (): Promise<AssignedCourse[]> => {
    const response = await apiClient.get<MyCoursesResponseItem[]>(
      "/course-semester/lecturer/my-courses",
    );
    return (response.data ?? []).map(mapToAssignedCourse);
  },

  /**
   * Update meeting URL and session details for a course the lecturer teaches.
   * Uses PATCH /course-semester/:id/lecturer-schedule. Only updates mode, location, meetingUrl.
   */
  updateCourseSchedule: async (
    courseOnSemesterId: string,
    data: {
      mode?: "ONLINE" | "ON_CAMPUS" | "HYBRID";
      location?: string | null;
      meetingUrl?: string | null;
    },
  ): Promise<void> => {
    await apiClient.patch(
      `/course-semester/${courseOnSemesterId}/lecturer-schedule`,
      data,
    );
  },

  /**
   * Request to teach a course-semester. Fails if semester not started, already has lecturer,
   * schedule conflict, or duplicate pending request.
   */
  requestToTeach: async (
    courseOnSemesterId: string,
  ): Promise<{ id: string; status: string }> => {
    const response = await apiClient.post<{ id: string; status: string }>(
      "/request/lecturer/teaching",
      { courseOnSemesterId },
    );
    return response.data;
  },

  /**
   * Get my teaching requests (pending, approved, rejected).
   */
  getMyTeachingRequests: async (): Promise<LecturerTeachingRequestItem[]> => {
    const response = await apiClient.get<LecturerTeachingRequestItem[]>(
      "/request/lecturer/teaching",
    );
    return response.data ?? [];
  },

  /**
   * Get course analytics (average grade, at-risk count, distribution).
   * Lecturer must be assigned to the course.
   */
  getCourseAnalytics: async (
    courseOnSemesterId: string,
  ): Promise<CourseAnalytics> => {
    const response = await apiClient.get<CourseAnalytics>(
      `/enrollment/course-semester/${courseOnSemesterId}/analytics`,
    );
    return response.data;
  },

  /**
   * Get student profile (lecturer view). Only for students the lecturer teaches.
   */
  getStudentProfile: async (
    studentId: string,
  ): Promise<LecturerStudentProfile> => {
    const response = await apiClient.get<LecturerStudentProfile>(
      `/lecturer/student/${studentId}`,
    );
    return response.data;
  },

  /**
   * Get students enrolled in a course (lecturer only)
   * Uses GET /enrollment/course-semester/:courseOnSemesterId endpoint
   * Backend returns enrollment with `id`; we map to `enrollmentId` for CourseStudent
   */
  getCourseStudents: async (
    courseOnSemesterId: string,
  ): Promise<CourseStudent[]> => {
    interface BackendEnrollment {
      id: string;
      gradeType1: number | null;
      gradeType2: number | null;
      gradeType3: number | null;
      finalGrade: number | null;
      student: {
        id: string;
        studentId: string | null;
        fullName: string | null;
        email: string;
        avatar: string | null;
      };
    }
    const response = await apiClient.get<BackendEnrollment[]>(
      `/enrollment/course-semester/${courseOnSemesterId}`,
    );
    return (response.data ?? []).map((e) => ({
      enrollmentId: e.id,
      student: e.student,
      grades: {
        gradeType1: e.gradeType1,
        gradeType2: e.gradeType2,
        gradeType3: e.gradeType3,
        finalGrade: e.finalGrade,
      },
    }));
  },

  /**
   * Update student grade (lecturer only)
   * Uses PATCH /enrollment/grade/:enrollmentId
   * Backend calculates finalGrade from gradeType1, gradeType2, gradeType3
   */
  updateGrade: async (
    enrollmentId: string,
    data: UpdateGradeData,
  ): Promise<CourseStudent> => {
    const payload: Record<string, number | undefined> = {};
    if (data.gradeType1 !== undefined && data.gradeType1 !== null)
      payload.gradeType1 = data.gradeType1;
    if (data.gradeType2 !== undefined && data.gradeType2 !== null)
      payload.gradeType2 = data.gradeType2;
    if (data.gradeType3 !== undefined && data.gradeType3 !== null)
      payload.gradeType3 = data.gradeType3;

    const response = await apiClient.patch<CourseStudent, typeof payload>(
      `/enrollment/grade/${enrollmentId}`,
      payload,
    );
    return response.data;
  },

  /**
   * @deprecated - Endpoint doesn't exist in backend
   * Schedule should be derived from course-semester data
   */
  getSchedule: async (): Promise<LecturerSchedule> => {
    console.warn(
      "[lecturerApi.getSchedule] This endpoint is not implemented in the backend",
    );
    return {};
  },
};
