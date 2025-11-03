import { Edu_AU_VIC_WA_NT_Pre } from "next/font/google";

export type StudentAccountResponse = {
  id: string;
  departmentId: string;
  username: string;
  email: string;
  studentId: string;
  fullName: string;
  gender: boolean;
  birthDate: string;
  citizenId: string;
  phone: string;
  address: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ReadAllStudentAccountsResponse = StudentAccountResponse[];

export type LecturerAccountResponse = {
  id: string;
  lecturerId: string; // this field is missing from backend
  email: string;
  username: string;
  fullName: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ReadAllLecturerAccountResponse = LecturerAccountResponse[];

export type DepartmentResponse = {
  id: string;
  departmentId: string; // this field is missing from backend
  name: string;
  description?: string;
  headId?: string;
  createdAt: string;
  updatedAt: string;
};

export type ReadAllDepartmentResponse = DepartmentResponse[];

export type ReadAdminAccountResponse = {
  id: string;
  username: string;
  password: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ReadAllAdminAccountsResponse = ReadAdminAccountResponse[];
