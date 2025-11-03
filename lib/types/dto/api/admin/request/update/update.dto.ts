export type UpdateStudentAccountRequest = {
  studentId?: string;
  departmentId?: string;
  email?: string;
  username?: string;
  newPassword?: string;
  confirmPassword?: string;
  fullName?: string;
  gender?: boolean;
  birthDate?: string;
  citizenId?: string;
  phone?: string;
  address?: string;
  active?: boolean;
};

export type UpdateLecturerAccountRequest = {
  lecturerId?: string;
  email?: string;
  username?: string;
  newPassword?: string;
  confirmPassword?: string;
  fullName?: string;
  isActive?: boolean;
};

export type UpdateDepartmentRequest = {
  departmentId?: string;
  name?: string;
  description?: string;
  headId?: string;
};
