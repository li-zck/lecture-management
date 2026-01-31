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

## Admin Enrollment Session Management Endpoints

- [x] `GET /admin/enrollment/session/all` - Get all enrollment sessions
- [x] `GET /admin/enrollment/session/:id` - Get enrollment session by ID
- [x] `GET /admin/enrollment/session/semester/:semesterId` - Get sessions by semester
- [x] `POST /admin/enrollment/session/create` - Create enrollment session
- [x] `POST /admin/enrollment/session/create-multiple` - Create multiple enrollment sessions
- [x] `PATCH /admin/enrollment/session/update/:id` - Update enrollment session
- [x] `DELETE /admin/enrollment/session/delete/:id` - Delete enrollment session
- [x] `DELETE /admin/enrollment/session/delete-multiple` - Delete multiple sessions

## Admin Notification Management Endpoints

- [x] `GET /admin/notification/all` - Get all notifications
- [x] `GET /admin/notification/user` - Get notifications by user (lecturerId/studentId)
- [x] `GET /admin/notification/:id` - Get notification by ID
- [x] `POST /admin/notification/create` - Create notification
- [x] `PATCH /admin/notification/:id` - Update notification
- [x] `DELETE /admin/notification/:id` - Delete notification

## Admin Post Management Endpoints

- [x] `GET /admin/post/all` - Get all posts
- [x] `GET /admin/post/find/:id` - Get post by ID
- [x] `GET /admin/post/department/:departmentId` - Get posts by department
- [x] `GET /admin/post/global` - Get global posts
- [x] `POST /admin/post/create` - Create post
- [x] `PATCH /admin/post/update/:id` - Update post
- [x] `DELETE /admin/post/delete/:id` - Delete post
- [x] `DELETE /admin/post/delete` - Delete multiple posts

## Admin Exam Schedule Management Endpoints

- [x] `GET /admin/exam-schedule/all` - Get all exam schedules
- [x] `GET /admin/exam-schedule/:id` - Get exam schedule by ID
- [x] `POST /admin/exam-schedule/create` - Create exam schedule
- [x] `POST /admin/exam-schedule/create-multiple` - Create multiple exam schedules
- [x] `PATCH /admin/exam-schedule/:id` - Update exam schedule
- [x] `DELETE /admin/exam-schedule/:id` - Delete exam schedule
- [x] `DELETE /admin/exam-schedule/delete-multiple` - Delete multiple exam schedules

## Admin Webhook Management Endpoints

- [x] `GET /admin/webhook/all` - Get all webhooks
- [x] `GET /admin/webhook/user` - Get webhooks by user (lecturerId/studentId)
- [x] `GET /admin/webhook/:id` - Get webhook by ID
- [x] `POST /admin/webhook/create` - Create webhook
- [x] `PATCH /admin/webhook/:id` - Update webhook
- [x] `PATCH /admin/webhook/:id/toggle` - Toggle webhook active status
- [x] `DELETE /admin/webhook/:id` - Delete webhook

---

# User-Facing Endpoints (Student/Lecturer)

## Public Student Endpoints

- [x] `GET /student/all` - Get all students (public list)
- [x] `GET /student/:id` - Get student by ID
- [x] `PATCH /student/update` - Update own student account

## Public Lecturer Endpoints

- [x] `GET /lecturer/all` - Get all lecturers (public list)
- [x] `GET /lecturer/:id` - Get lecturer by ID
- [x] `PATCH /lecturer/update` - Update own lecturer account

## Public Course Endpoints

- [x] `GET /course/all` - Get all courses
- [x] `GET /course/department/:departmentId` - Get courses by department
- [x] `GET /course/find/:id` - Get course by ID

## Student Enrollment Endpoints

- [x] `GET /enrollment/my-enrollments` - Get own enrollments
- [x] `GET /enrollment/my-enrollments/:id` - Get own enrollment by ID
- [x] `POST /enrollment/enroll` - Enroll in course
- [x] `DELETE /enrollment/unenroll/:id` - Unenroll from course

## Lecturer Enrollment Endpoints

- [x] `GET /enrollment/course-semester/:courseOnSemesterId` - Get enrollments by course-semester

## Enrollment Session Endpoints

- [x] `GET /enrollment/session/all` - Get all active enrollment sessions
- [x] `GET /enrollment/session/:id` - Get active session by ID
- [x] `GET /enrollment/session/semester/:semesterId` - Get active sessions by semester

## Public Department Endpoints

- [x] `GET /department/all` - Get all departments
- [x] `GET /department/find/:id` - Get department by ID

## Public Semester Endpoints

- [x] `GET /semester/all` - Get all semesters
- [x] `GET /semester/find/:id` - Get semester by ID

## Public Course-Semester Endpoints

- [x] `GET /course-semester/all` - Get all course-semesters
- [x] `GET /course-semester/find/:id` - Get course-semester by ID

## Document Endpoints

- [x] `GET /document/all` - Get all documents
- [x] `GET /document/:id` - Get document by ID
- [x] `POST /document/create` - Create document (Lecturer only)
- [x] `PATCH /document/update/:id` - Update document (Lecturer only)
- [x] `DELETE /document/delete/:id` - Delete document (Lecturer only)

## Student Notification Endpoints

- [x] `GET /notification/student/all` - Get own notifications
- [x] `GET /notification/student/:id` - Get notification by ID
- [x] `DELETE /notification/student/all` - Delete all notifications
- [x] `DELETE /notification/student/:id` - Delete notification by ID

## Lecturer Notification Endpoints

- [x] `GET /notification/lecturer/all` - Get own notifications
- [x] `GET /notification/lecturer/:id` - Get notification by ID
- [x] `DELETE /notification/lecturer/all` - Delete all notifications
- [x] `DELETE /notification/lecturer/:id` - Delete notification by ID

## Student Webhook Endpoints

- [x] `GET /webhook/student/all` - Get own webhooks
- [x] `GET /webhook/student/:id` - Get webhook by ID
- [x] `POST /webhook/student/create` - Create webhook
- [x] `PATCH /webhook/student/:id` - Update webhook
- [x] `PATCH /webhook/student/:id/toggle` - Toggle webhook active status
- [x] `DELETE /webhook/student/:id` - Delete webhook

## Lecturer Webhook Endpoints

- [x] `GET /webhook/lecturer/all` - Get own webhooks
- [x] `GET /webhook/lecturer/:id` - Get webhook by ID
- [x] `POST /webhook/lecturer/create` - Create webhook
- [x] `PATCH /webhook/lecturer/:id` - Update webhook
- [x] `PATCH /webhook/lecturer/:id/toggle` - Toggle webhook active status
- [x] `DELETE /webhook/lecturer/:id` - Delete webhook

## Public Post Endpoints

- [x] `GET /post/global` - Get global posts
- [x] `GET /post/department/:departmentId` - Get posts by department
- [x] `GET /post/:id` - Get post by ID

## Exam Schedule Endpoints

- [x] `GET /exam-schedule/all` - Get all exam schedules
- [x] `GET /exam-schedule/:id` - Get exam schedule by ID
- [x] `GET /exam-schedule/student/my-schedules` - Get own exam schedules (Student)
- [x] `GET /exam-schedule/lecturer/my-courses` - Get exam schedules for own courses (Lecturer)
- [x] `POST /exam-schedule/lecturer/create` - Create exam schedule (Lecturer)
- [x] `PATCH /exam-schedule/lecturer/:id` - Update exam schedule (Lecturer)
- [x] `DELETE /exam-schedule/lecturer/:id` - Delete exam schedule (Lecturer)

## Application Endpoints

- [x] `GET /` - Root endpoint (returns hello message)

---

# Summary

## Implementation Status

| Category | Implemented | Total | Percentage |
|----------|-------------|-------|------------|
| Auth | 4 | 4 | 100% |
| Admin Core | 5 | 5 | 100% |
| Admin Student | 8 | 8 | 100% |
| Admin Lecturer | 7 | 7 | 100% |
| Admin Department | 7 | 7 | 100% |
| Admin Course | 7 | 7 | 100% |
| Admin Enrollment | 6 | 6 | 100% |
| Admin Semester | 6 | 6 | 100% |
| Admin Course-Semester | 6 | 6 | 100% |
| Admin Enrollment Session | 8 | 8 | 100% |
| Admin Notification | 6 | 6 | 100% |
| Admin Post | 8 | 8 | 100% |
| Admin Exam Schedule | 7 | 7 | 100% |
| Admin Webhook | 7 | 7 | 100% |
| User Student | 3 | 3 | 100% |
| User Lecturer | 3 | 3 | 100% |
| User Course | 3 | 3 | 100% |
| User Enrollment (Student) | 4 | 4 | 100% |
| User Enrollment (Lecturer) | 1 | 1 | 100% |
| User Enrollment Session | 3 | 3 | 100% |
| User Department | 2 | 2 | 100% |
| User Semester | 2 | 2 | 100% |
| User Course-Semester | 2 | 2 | 100% |
| User Document | 5 | 5 | 100% |
| User Notification (Student) | 4 | 4 | 100% |
| User Notification (Lecturer) | 4 | 4 | 100% |
| User Webhook (Student) | 6 | 6 | 100% |
| User Webhook (Lecturer) | 6 | 6 | 100% |
| User Post | 3 | 3 | 100% |
| User Exam Schedule | 7 | 7 | 100% |

**Total: 145 / 145 endpoints implemented (100%)**

## All Features Implemented

All 145 endpoints have been implemented with:
- Type-safe API clients
- TanStack Query hooks for data fetching
- Mutation hooks with automatic cache invalidation
- Toast notifications for user feedback

## Notes

- All admin endpoints require authentication and admin role
- Most endpoints support query parameters for including related data
- File upload endpoints support multipart/form-data
- Batch operations available for create/update/delete operations
- WebSocket support exists in backend for real-time notifications
