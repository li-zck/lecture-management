# API Endpoints Documentation
These endpoints will only be considered as done when fulfilled these criteria:
1. Have explicit type annotations for request and response DTOs.
2. Have explicit methods defined in the corresponding `method.ts` files.
3. Have UI accessibility which can interact with and prints out the corresponding information.
4. Have proper error handling and comments.

## Authentication Endpoints

- [x] `POST /auth/admin/signup` - Admin user registration
- [x] `POST /auth/admin/signin` - Admin user login
- [x] `POST /auth/student/signin` - Student user login
- [x] `POST /auth/lecturer/signin` - Lecturer user login

## Admin Management Endpoints

- [x] `GET /admin/all` - Get all admin users
- [x] `GET /admin/find/:id` - Get admin user by ID
- [x] `POST /admin/create` - Create new admin user
- [x] `PATCH /admin/update/:id` - Update admin user
- [x] `DELETE /admin/delete/:id` - Delete admin user

## Admin Student Management Endpoints

- [x] `GET /admin/student/all` - Get all students
- [x] `GET /admin/student/find/:id` - Get student by ID
- [x] `GET /admin/student/find` - Find students by email/studentId/username/citizenId/phone
- [x] `POST /admin/student/create` - Create single student
- [x] `POST /admin/student/create/multiple` - Create multiple students
- [x] `PATCH /admin/student/update/:id` - Update student
- [x] `DELETE /admin/student/delete/:id` - Delete single student
- [x] `DELETE /admin/student/delete` - Delete multiple students

## Admin Lecturer Management Endpoints

- [x] `GET /admin/lecturer/all` - Get all lecturers
- [x] `GET /admin/lecturer/find/:id` - Get lecturer by ID
- [x] `POST /admin/lecturer/create` - Create single lecturer
- [x] `POST /admin/lecturer/create/multiple` - Create multiple lecturers
- [x] `PATCH /admin/lecturer/update/:id` - Update lecturer
- [x] `DELETE /admin/lecturer/delete/:id` - Delete single lecturer
- [x] `DELETE /admin/lecturer/delete` - Delete multiple lecturers

## Admin Department Management Endpoints

- [x] `GET /admin/department/all` - Get all departments
- [x] `GET /admin/department/find/:id` - Get department by ID
- [x] `POST /admin/department/create` - Create single department
- [x] `POST /admin/department/create/multiple` - Create multiple departments
- [x] `PATCH /admin/department/update/:id` - Update department
- [x] `DELETE /admin/department/delete/:id` - Delete single department
- [x] `DELETE /admin/department/delete` - Delete multiple departments

## Admin Course Management Endpoints

- [x] `GET /admin/course/all` - Get all courses
- [x] `GET /admin/course/find/:id` - Get course by ID (with optional attachments/department includes)
- [x] `GET /admin/course/department/:departmentId` - Get courses by department ID
- [x] `POST /admin/course/create` - Create course (with file uploads)
- [x] `PATCH /admin/course/update/:id` - Update course (with file uploads)
- [x] `DELETE /admin/course/delete/:id` - Delete single course
- [x] `DELETE /admin/course/delete/` - Delete multiple courses

## Admin Course Enrollment Management Endpoints

- [x] `GET /admin/course/enrollment/all` - Get all enrollments (with optional includes)
- [x] `GET /admin/course/enrollment/find/:id` - Get enrollment by ID (with optional includes)
- [x] `POST /admin/course/enrollment/create` - Create course enrollment
- [x] `PATCH /admin/course/enrollment/update/:id` - Update course enrollment
- [x] `DELETE /admin/course/enrollment/delete/:id` - Delete single enrollment
- [x] `DELETE /admin/course/enrollment/delete` - Delete multiple enrollments

## Admin Semester Management Endpoints

- [x] `GET /admin/semester/all` - Get all semesters
- [x] `GET /admin/semester/find/:id` - Get semester by ID
- [x] `POST /admin/semester/create` - Create semester
- [x] `PATCH /admin/semester/update/:id` - Update semester
- [x] `DELETE /admin/semester/delete/:id` - Delete single semester
- [x] `DELETE /admin/semester/delete` - Delete multiple semesters

## Admin Course-Semester Management Endpoints

- [x] `GET /admin/semester/course/all` - Get all course-semester relationships
- [x] `GET /admin/semester/course/:id` - Get course-semester by ID
- [x] `POST /admin/semester/course/create` - Create course-semester relationship
- [x] `PUT /admin/semester/course/update/:id` - Update course-semester relationship
- [x] `DELETE /admin/semester/course/delete/:id` - Delete single course-semester
- [x] `DELETE /admin/semester/course/delete` - Delete multiple course-semesters

## Application Endpoints

- [x] `GET /` - Root endpoint (returns hello message)

## Notes

- All admin endpoints require authentication and admin role
- Most endpoints support query parameters for including related data
- File upload endpoints support multipart/form-data
- Batch operations available for create/update/delete operations
