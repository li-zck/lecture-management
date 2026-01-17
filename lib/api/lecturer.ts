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
    getProfile: async (): Promise<LecturerProfile> => {
        const response = await apiClient.get<LecturerProfile>("/lecturer/profile");
        return response.data;
    },

    updateProfile: async (data: {
        fullName?: string;
    }): Promise<LecturerProfile> => {
        const response = await apiClient.patch<LecturerProfile, typeof data>("/lecturer/profile", data);
        return response.data;
    },

    getCourses: async (): Promise<AssignedCourse[]> => {
        const response = await apiClient.get<AssignedCourse[]>("/lecturer/courses");
        return response.data;
    },

    getCourseStudents: async (
        courseOnSemesterId: string
    ): Promise<CourseStudent[]> => {
        const response = await apiClient.get<CourseStudent[]>(
            `/lecturer/courses/${courseOnSemesterId}/students`
        );
        return response.data;
    },

    updateGrade: async (
        courseOnSemesterId: string,
        data: UpdateGradeData
    ): Promise<{ message: string }> => {
        const response = await apiClient.patch<{ message: string }, UpdateGradeData>(
            `/lecturer/courses/${courseOnSemesterId}/grades`,
            data
        );
        return response.data;
    },

    getSchedule: async (): Promise<LecturerSchedule> => {
        const response = await apiClient.get<LecturerSchedule>("/lecturer/schedule");
        return response.data;
    },
};
