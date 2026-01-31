import { apiClient } from "./client";

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

export interface UpdateGradeData {
    studentId: string;
    gradeType1?: number | null;
    gradeType2?: number | null;
    gradeType3?: number | null;
    finalGrade?: number | null;
}

export type LecturerSchedule = Record<
    number,
    Array<{
        courseName: string;
        startTime: number | null;
        endTime: number | null;
        location: string | null;
        lecturer: string | null;
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
     */
    updateProfile: async (data: {
        fullName?: string;
    }): Promise<LecturerProfile> => {
        const response = await apiClient.patch<LecturerProfile, typeof data>("/lecturer/update", data);
        return response.data;
    },

    /**
     * @deprecated - Endpoint doesn't exist in backend
     * Courses should be fetched from course-semester endpoint
     */
    getCourses: async (): Promise<AssignedCourse[]> => {
        console.warn("[lecturerApi.getCourses] This endpoint is not implemented in the backend");
        return [];
    },

    /**
     * Get students enrolled in a course (lecturer only)
     * Uses GET /enrollment/course-semester/:courseOnSemesterId endpoint
     */
    getCourseStudents: async (
        courseOnSemesterId: string
    ): Promise<CourseStudent[]> => {
        // Note: Backend returns enrollment data with student info
        const response = await apiClient.get<CourseStudent[]>(
            `/enrollment/course-semester/${courseOnSemesterId}`
        );
        return response.data;
    },

    /**
     * @deprecated - Endpoint doesn't exist in backend
     * Grade updates should use enrollment/admin endpoints
     */
    updateGrade: async (
        _courseOnSemesterId: string,
        _data: UpdateGradeData
    ): Promise<{ message: string }> => {
        console.warn("[lecturerApi.updateGrade] This endpoint is not implemented in the backend");
        return { message: "Not implemented" };
    },

    /**
     * @deprecated - Endpoint doesn't exist in backend
     * Schedule should be derived from course-semester data
     */
    getSchedule: async (): Promise<LecturerSchedule> => {
        console.warn("[lecturerApi.getSchedule] This endpoint is not implemented in the backend");
        return {};
    },
};
