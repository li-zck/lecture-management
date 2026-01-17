import { apiClient } from "./client";

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
    getProfile: async (): Promise<StudentProfile> => {
        const response = await apiClient.get<StudentProfile>("/student/profile");
        return response.data;
    },

    updateProfile: async (data: {
        fullName?: string;
        phone?: string;
        address?: string;
        avatar?: string;
    }): Promise<StudentProfile> => {
        const response = await apiClient.patch<StudentProfile, typeof data>("/student/profile", data);
        return response.data;
    },

    getCourses: async (): Promise<EnrolledCourse[]> => {
        const response = await apiClient.get<EnrolledCourse[]>("/student/courses");
        return response.data;
    },

    getGrades: async (): Promise<GradeSummary[]> => {
        const response = await apiClient.get<GradeSummary[]>("/student/grades");
        return response.data;
    },

    getSchedule: async (): Promise<WeeklySchedule> => {
        const response = await apiClient.get<WeeklySchedule>("/student/schedule");
        return response.data;
    },

    getAvailableCourses: async (): Promise<AvailableCourse[]> => {
        const response = await apiClient.get<AvailableCourse[]>("/student/available-courses");
        return response.data;
    },

    enrollCourse: async (courseOnSemesterId: string): Promise<any> => {
        const response = await apiClient.post<any, any>(`/student/enroll/${courseOnSemesterId}`);
        return response.data;
    },

    withdrawCourse: async (enrollmentId: string): Promise<any> => {
        const response = await apiClient.delete<any>(`/student/withdraw/${enrollmentId}`);
        return response.data;
    },

    getCourseDocuments: async (enrollmentId: string): Promise<CourseDocument[]> => {
        const response = await apiClient.get<CourseDocument[]>(`/student/courses/${enrollmentId}/documents`);
        return response.data;
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

