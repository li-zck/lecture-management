import { apiClient } from "./client";
import { documentApi } from "./document";

export interface StudentProfile {
  id: string;
  email: string;
  username: string;
  studentId: string | null;
  fullName: string | null;
  gender: boolean | null;
  birthDate: string | null;
  citizenId: string | null;
  phone: string | null;
  address: string | null;
  avatar: string | null;
  active: boolean;
  department: {
    id: string;
    name: string;
  } | null;
}

export interface EnrolledCourse {
  enrollmentId: string;
  /** Course-semester (offering) ID for matching browse catalog */
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
  };
  lecturer: {
    id: string;
    fullName: string | null;
    email: string;
    lecturerId: string;
  } | null;
  schedule: {
    dayOfWeek: number | null;
    startTime: number | null;
    endTime: number | null;
    location: string | null;
  };
  grades: {
    gradeType1: number | null;
    gradeType2: number | null;
    gradeType3: number | null;
    finalGrade: number | null;
  };
}

export interface GradeSummary {
  courseName: string;
  credits: number;
  semester: string;
  gradeType1: number | null;
  gradeType2: number | null;
  gradeType3: number | null;
  finalGrade: number | null;
}

export type WeeklySchedule = Record<
  number,
  Array<{
    courseName: string;
    startTime: number | null;
    endTime: number | null;
    location: string | null;
    lecturer: string | null;
  }>
>;

export const studentApi = {
  /**
   * Get student profile by ID
   * Uses the /student/:id endpoint with query parameter
   * @param id - Student's internal ID (from access token)
   */
  getById: async (id: string): Promise<StudentProfile> => {
    // Backend uses @Query('id') so we pass it as query parameter
    const response = await apiClient.get<StudentProfile>(`/student/${id}`, {
      params: { id },
    });
    return response.data;
  },

  /**
   * Update own profile (authenticated student)
   * Uses @GetUser() decorator on backend - no ID needed
   * Matches backend StudentUpdateAccountDto
   */
  updateProfile: async (data: {
    username?: string;
    fullName?: string;
    gender?: boolean;
    birthDate?: string;
    citizenId?: string;
    phone?: string;
    address?: string;
    oldPassword?: string;
    password?: string;
  }): Promise<StudentProfile> => {
    const response = await apiClient.patch<StudentProfile, typeof data>(
      "/student/update",
      data,
    );
    return response.data;
  },

  /**
   * Get student's enrolled courses
   * Uses /enrollment/my-enrollments endpoint (requires auth)
   */
  getEnrollments: async (): Promise<EnrolledCourse[]> => {
    // Backend returns raw enrollment data with nested courseOnSemester
    // Transform to match EnrolledCourse interface
    interface BackendEnrollment {
      id: string;
      gradeType1: number | null;
      gradeType2: number | null;
      gradeType3: number | null;
      finalGrade: number | null;
      courseOnSemester: {
        id: string;
        location: string | null;
        dayOfWeek: number | null;
        startTime: number | null;
        endTime: number | null;
        course: {
          id: string;
          name: string;
          credits: number;
          departmentId: string | null;
          department?: { name: string } | null;
        };
        semester: {
          id: string;
          name: string;
        };
        lecturer: {
          id: string;
          fullName: string | null;
          email: string;
          lecturerId: string;
        } | null;
      };
    }

    const response = await apiClient.get<BackendEnrollment[]>(
      "/enrollment/my-enrollments",
    );

    return response.data.map(
      (enrollment): EnrolledCourse => ({
        enrollmentId: enrollment.id,
        courseOnSemesterId: enrollment.courseOnSemester.id,
        course: {
          id: enrollment.courseOnSemester.course.id,
          name: enrollment.courseOnSemester.course.name,
          credits: enrollment.courseOnSemester.course.credits,
          department:
            enrollment.courseOnSemester.course.department?.name ?? null,
        },
        semester: {
          id: enrollment.courseOnSemester.semester.id,
          name: enrollment.courseOnSemester.semester.name,
        },
        lecturer: enrollment.courseOnSemester.lecturer,
        schedule: {
          dayOfWeek: enrollment.courseOnSemester.dayOfWeek,
          startTime: enrollment.courseOnSemester.startTime,
          endTime: enrollment.courseOnSemester.endTime,
          location: enrollment.courseOnSemester.location,
        },
        grades: {
          gradeType1: enrollment.gradeType1,
          gradeType2: enrollment.gradeType2,
          gradeType3: enrollment.gradeType3,
          finalGrade: enrollment.finalGrade,
        },
      }),
    );
  },

  /**
   * Get a single enrollment by ID (student only)
   * Uses GET /enrollment/my-enrollments/:id
   */
  getMyEnrollmentById: async (id: string): Promise<EnrolledCourse> => {
    interface BackendEnrollment {
      id: string;
      gradeType1: number | null;
      gradeType2: number | null;
      gradeType3: number | null;
      finalGrade: number | null;
      courseOnSemester: {
        id: string;
        location: string | null;
        dayOfWeek: number | null;
        startTime: number | null;
        endTime: number | null;
        course: {
          id: string;
          name: string;
          credits: number;
          departmentId: string | null;
          department?: { name: string } | null;
        };
        semester: { id: string; name: string };
        lecturer: {
          id: string;
          fullName: string | null;
          email: string;
          lecturerId: string;
        } | null;
      };
    }

    const response = await apiClient.get<BackendEnrollment>(
      `/enrollment/my-enrollments/${id}`,
    );
    const e = response.data;
    return {
      enrollmentId: e.id,
      courseOnSemesterId: e.courseOnSemester.id,
      course: {
        id: e.courseOnSemester.course.id,
        name: e.courseOnSemester.course.name,
        credits: e.courseOnSemester.course.credits,
        department: e.courseOnSemester.course.department?.name ?? null,
      },
      semester: {
        id: e.courseOnSemester.semester.id,
        name: e.courseOnSemester.semester.name,
      },
      lecturer: e.courseOnSemester.lecturer,
      schedule: {
        dayOfWeek: e.courseOnSemester.dayOfWeek,
        startTime: e.courseOnSemester.startTime,
        endTime: e.courseOnSemester.endTime,
        location: e.courseOnSemester.location,
      },
      grades: {
        gradeType1: e.gradeType1,
        gradeType2: e.gradeType2,
        gradeType3: e.gradeType3,
        finalGrade: e.finalGrade,
      },
    };
  },

  /**
   * @deprecated - Endpoint doesn't exist in backend
   * Grades should be accessed through enrollment data
   */
  getGrades: async (): Promise<GradeSummary[]> => {
    console.warn(
      "[studentApi.getGrades] This endpoint is not implemented in the backend",
    );
    return [];
  },

  /**
   * @deprecated - Endpoint doesn't exist in backend
   * Schedule should be derived from enrollment data
   */
  getSchedule: async (): Promise<WeeklySchedule> => {
    console.warn(
      "[studentApi.getSchedule] This endpoint is not implemented in the backend",
    );
    return {};
  },

  /**
   * @deprecated - Endpoint doesn't exist in backend
   * Available courses should be fetched from course-semester endpoint
   */
  getAvailableCourses: async (): Promise<AvailableCourse[]> => {
    console.warn(
      "[studentApi.getAvailableCourses] This endpoint is not implemented in the backend",
    );
    return [];
  },

  /**
   * Enroll in a course
   * Uses POST /enrollment/enroll endpoint
   */
  enrollCourse: async (courseOnSemesterId: string): Promise<unknown> => {
    const response = await apiClient.post<
      unknown,
      { courseOnSemesterId: string }
    >("/enrollment/enroll", { courseOnSemesterId });
    return response.data;
  },

  /**
   * Withdraw/unenroll from a course
   * Uses DELETE /enrollment/unenroll/:id endpoint
   */
  withdrawCourse: async (enrollmentId: string): Promise<unknown> => {
    const response = await apiClient.delete<unknown>(
      `/enrollment/unenroll/${enrollmentId}`,
    );
    return response.data;
  },

  /**
   * Get documents for a course (by courseOnSemesterId)
   * Uses documentApi.getAll() and filters by courseOnSemesterId
   */
  getCourseDocuments: async (
    courseOnSemesterId: string,
  ): Promise<CourseDocument[]> => {
    const all = await documentApi.getAll();
    const filtered = all.filter(
      (d) => d.courseOnSemesterId === courseOnSemesterId,
    );
    return filtered.map((d) => ({
      id: d.id,
      title: d.title,
      path: d.path,
      url: d.url ?? "",
      createdAt: d.createdAt,
    }));
  },
};

export interface AvailableCourse {
  courseOnSemesterId: string;
  course: {
    id: string;
    name: string;
    credits: number;
    department: string | null;
  };
  semester: string;
  lecturer: {
    fullName: string | null;
    lecturerId: string;
  } | null;
  schedule: {
    dayOfWeek: number | null;
    startTime: number | null;
    endTime: number | null;
    location: string | null;
  };
  enrolledCount: number;
  capacity: number | null;
  hasCapacity: boolean;
}

export interface CourseDocument {
  id: string;
  title: string;
  path: string;
  url: string;
  createdAt: string;
}
