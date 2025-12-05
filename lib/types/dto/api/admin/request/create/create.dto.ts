import { getEntityId } from "@/lib/utils";

export type CreateStudentAccountRequest = {
  departmentId: string;
  username: string;
  email: string;
  password: string;
  studentId: string;
  fullName: string;
  gender: boolean;
  birthDate?: string;
  citizenId?: string;
  phone?: string;
  address?: string;
};

export type CreateLecturerAccountRequest = {
  lecturerId: string;
  username: string;
  email: string;
  fullName: string;
  password: string;
};

export type CreateDepartmentRequest = {
  name: string;
  description?: string;
  headId?: string;
};
