# API Client Documentation

This directory contains a comprehensive, type-safe API client for the Lecture Management System frontend. The implementation uses native `fetch` API for better Next.js integration and improved performance.

## Overview

The API client is organized into the following modules:

- **`client.ts`** - Core API client with HTTP methods (GET, POST, PATCH, PUT, DELETE)
- **`auth.ts`** - Authentication endpoints for all user roles
- **`admin.ts`** - Admin user management
- **`admin-student.ts`** - Student management (admin)
- **`admin-lecturer.ts`** - Lecturer management (admin)
- **`admin-department.ts`** - Department management (admin)
- **`admin-course.ts`** - Course management (admin)
- **`admin-enrollment.ts`** - Enrollment management (admin)
- **`admin-semester.ts`** - Semester management (admin)
- **`admin-course-semester.ts`** - Course-Semester relationship management (admin)
- **`student.ts`** - Student user endpoints
- **`lecturer.ts`** - Lecturer user endpoints

## Getting Started

### Basic Usage

```typescript
import { authApi, adminStudentApi } from "@/lib/api";

// Sign in as admin
const signIn = async () => {
  try {
    const response = await authApi.adminSignIn({
      username: "admin@example.com",
      password: "password123",
    });

    // Token is automatically stored in cookies
    console.log("Sign in successful:", response.token);
  } catch (error) {
    console.error("Sign in failed:", error.message);
  }
};

// Get all students
const getStudents = async () => {
  try {
    const students = await adminStudentApi.getAll();
    console.log("Students:", students);
  } catch (error) {
    console.error("Failed to fetch students:", error.message);
  }
};
```

### Error Handling

All API methods throw an `ApiError` with structured error information:

```typescript
import { adminStudentApi, type ApiError } from "@/lib/api";

try {
  const student = await adminStudentApi.getById("invalid-id");
} catch (error) {
  const apiError = error as ApiError;
  console.error(`Error ${apiError.status}: ${apiError.message}`);
  // apiError.details contains the raw error response
}
```

### Using Query Parameters

```typescript
// Get courses with optional includes
const courses = await adminCourseApi.getAll({
  includeAttachments: true,
  includeDepartment: true,
});

// Search for students
const results = await adminStudentApi.search({
  email: "john@example.com",
  phone: "123456789",
});
```

## API Examples

### Authentication

```typescript
import { authApi } from "@/lib/api";

// Admin sign in
await authApi.adminSignIn({ username: "admin", password: "pass" });

// Student sign in
await authApi.studentSignIn({ username: "student", password: "pass" });

// Lecturer sign in
await authApi.lecturerSignIn({ username: "lecturer", password: "pass" });

// Sign out (clears cookie)
authApi.signOut();
```

### Admin Operations

#### Managing Students

```typescript
import { adminStudentApi } from "@/lib/api";

// Get all students
const students = await adminStudentApi.getAll();

// Get student by ID
const student = await adminStudentApi.getById("student-id");

// Search students
const searchResults = await adminStudentApi.search({
  email: "john@example.com",
  studentId: "ST2026001",
});

// Create student
const newStudent = await adminStudentApi.create({
  email: "new@student.com",
  username: "newstudent",
  password: "securepass",
  fullName: "John Doe",
  departmentId: "dept-id",
});

// Create multiple students
const result = await adminStudentApi.createMultiple([
  { email: "student1@example.com", username: "student1", password: "pass1" },
  { email: "student2@example.com", username: "student2", password: "pass2" },
]);
console.log(`Created ${result.created} students`);

// Update student
const updated = await adminStudentApi.update("student-id", {
  fullName: "Jane Doe",
  phone: "123456789",
});

// Delete student
await adminStudentApi.delete("student-id");

// Delete multiple students
await adminStudentApi.deleteMultiple(["id1", "id2", "id3"]);
```

#### Managing Courses

```typescript
import { adminCourseApi } from "@/lib/api";

// Get all courses
const courses = await adminCourseApi.getAll({
  includeAttachments: true,
  includeDepartment: true,
});

// Get course by department
const deptCourses = await adminCourseApi.getByDepartment("department-id");

// Create course
const newCourse = await adminCourseApi.create({
  name: "Introduction to Programming",
  credits: 3,
  departmentId: "dept-id",
});

// Update course
await adminCourseApi.update("course-id", {
  name: "Advanced Programming",
  credits: 4,
});

// Delete course
await adminCourseApi.delete("course-id");
```

#### Managing Enrollments

```typescript
import { adminEnrollmentApi } from "@/lib/api";

// Get all enrollments with detailed info
const enrollments = await adminEnrollmentApi.getAll({
  includeStudent: true,
  includeCourse: true,
});

// Create enrollment
const enrollment = await adminEnrollmentApi.create({
  studentId: "student-id",
  courseOnSemesterId: "course-semester-id",
});

// Update grades
await adminEnrollmentApi.update("enrollment-id", {
  gradeType1: 85,
  gradeType2: 90,
  gradeType3: 88,
  finalGrade: 87.5,
});

// Delete enrollment
await adminEnrollmentApi.delete("enrollment-id");
```

#### Managing Semesters & Course Schedules

```typescript
import { adminSemesterApi, adminCourseSemesterApi } from "@/lib/api";

// Create semester
const semester = await adminSemesterApi.create({
  name: "Fall 2026",
  startDate: "2026-09-01",
  endDate: "2026-12-31",
});

// Create course offering for a semester
const offering = await adminCourseSemesterApi.create({
  courseId: "course-id",
  semesterId: semester.id,
  lecturerId: "lecturer-id",
  dayOfWeek: 1, // Monday
  startTime: 900, // 9:00 AM
  endTime: 1050, // 10:50 AM
  location: "Room 301",
  capacity: 50,
});

// Update schedule
await adminCourseSemesterApi.update(offering.id, {
  location: "Room 402",
  capacity: 60,
});
```

### Student Operations

```typescript
import { studentApi } from "@/lib/api";

// Get profile
const profile = await studentApi.getProfile();

// Update profile
await studentApi.updateProfile({
  fullName: "Updated Name",
  phone: "987654321",
  address: "123 Main St",
});

// Get enrolled courses
const courses = await studentApi.getCourses();

// Get grades
const grades = await studentApi.getGrades();

// Get weekly schedule
const schedule = await studentApi.getSchedule();

// Get available courses for enrollment
const availableCourses = await studentApi.getAvailableCourses();

// Enroll in a course
await studentApi.enrollCourse("course-semester-id");

// Withdraw from a course
await studentApi.withdrawCourse("enrollment-id");

// Get course documents
const documents = await studentApi.getCourseDocuments("enrollment-id");
```

### Lecturer Operations

```typescript
import { lecturerApi } from "@/lib/api";

// Get profile
const profile = await lecturerApi.getProfile();

// Update profile
await lecturerApi.updateProfile({
  fullName: "Dr. Smith",
});

// Get assigned courses
const courses = await lecturerApi.getCourses();

// Get students in a course
const students = await lecturerApi.getCourseStudents("course-semester-id");

// Update student grades
await lecturerApi.updateGrade("course-semester-id", {
  studentId: "student-id",
  gradeType1: 90,
  gradeType2: 85,
  gradeType3: 92,
  finalGrade: 89,
});

// Get lecturer schedule
const schedule = await lecturerApi.getSchedule();
```

## Best Practices

### 1. Use Try-Catch for Error Handling

```typescript
import { toast } from "sonner";

const handleCreateStudent = async (data: CreateStudentRequest) => {
  try {
    const student = await adminStudentApi.create(data);
    toast.success("Student created successfully");
    return student;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.message);
    throw error;
  }
};
```

### 2. Create Custom Hooks

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminStudentApi } from "@/lib/api";

export const useStudents = () => {
  return useQuery({
    queryKey: ["students"],
    queryFn: () => adminStudentApi.getAll(),
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminStudentApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};
```

### 3. Type Safety

All API methods are fully typed. Use TypeScript's type inference:

```typescript
import type { StudentAdmin, CreateStudentRequest } from "@/lib/api";

const students: StudentAdmin[] = await adminStudentApi.getAll();

const createData: CreateStudentRequest = {
  email: "test@example.com",
  username: "testuser",
  password: "password123",
  // TypeScript will enforce required fields and types
};
```

## Migration from Axios

The new API client uses native `fetch` instead of axios. Key differences:

1. **No axios dependency** - Lighter bundle size
2. **Better Next.js integration** - Works seamlessly with Next.js middleware
3. **Automatic cookie handling** - `credentials: "include"` is set by default
4. **Consistent error handling** - All errors follow the `ApiError` interface

Replace old axios calls:

```typescript
// OLD (axios)
const response = await apiClient.get("/admin/student/all");
const students = response.data;

// NEW (fetch-based client)
const students = await adminStudentApi.getAll();
// data is already extracted
```

## Notes

- All admin endpoints require authentication with admin role
- Cookies are automatically included in requests (`credentials: "include"`)
- The base URL is configured via `NEXT_PUBLIC_BACKEND_URL` environment variable
- All timestamps are ISO 8601 strings
- File uploads are not yet implemented (use multipart/form-data separately)
