# Admin UI Implementation Ideas

This document lists frontend UI ideas for the admin site. All items below use **existing backend APIs and hooks**—no new backend features required. Implement in the order that best fits your roadmap.

---

## TODO — Progress Tracker

Use this list to track what’s done and what you’re working on. Check off items as you complete them.

### 1. Admin Dashboard (`/admin`)

- [x] Entity counts trend (stat cards already show counts)
- [x] Enrollments snapshot
- [x] Schedules / capacity
- [x] Department distribution
- [x] Enrollment sessions status

### 2. Students (`/admin/management/student`)

- [x] Overview tab
- [x] Students by department (bar chart)
- [x] Sign-ups over time (bar/line)
- [ ] Students by semester/level (if applicable)

### 3. Lecturers (`/admin/management/lecturer`)

- [x] Overview tab
- [x] Lecturers over time (bar/line)
- [x] Workload / assignments (bar chart)

### 4. Departments (`/admin/management/department`)

- [x] Overview tab (charts + table)
- [x] Students by department (bar chart)
- [x] Student sign-ups over time (bar chart)
- [ ] Courses per department (optional)
- [ ] Lecturers per department (optional)

### 5. Courses (`/admin/management/course`)

- [x] Overview tab
- [x] Courses by department (bar chart)
- [x] Credits distribution (bar/histogram)

### 6. Semesters (`/admin/management/semester`)

- [x] Overview tab
- [x] Offerings per semester (bar chart)
- [x] Enrollment sessions per semester (bar/list)

### 7. Course-Semesters (`/admin/management/course-semester`)

- [x] Overview tab
- [x] Schedules by day (bar chart)
- [ ] Enrollment load (bar chart)
- [x] Lecturer workload (bar chart)

### 8. Enrollment Sessions (`/admin/management/enrollment-session`)

- [x] Overview tab
- [x] Sessions by semester (bar/list)
- [x] Timeline (sessions by date)

### 9. Enrollments (optional — no dedicated page today)

- [ ] Enrollments list page (table + filters)
- [ ] Enrollments overview (cards/charts)
- [ ] Grade summary — aggregate only (histogram)

### 10. Shared patterns

- [ ] Reusable chart wrapper / `AdminChartCard` (optional)
- [ ] Consistent loading & empty states for charts

---

## Current State (Summary)

- **Dashboard** (`/admin`): Stat cards (Students, Lecturers, Departments, Courses, Semesters), Quick Actions, System Overview. No charts yet.
- **Departments** (`/admin/management/department`): Has **Overview** (charts) + **Edit departments** (table) tabs. Charts: (1) Students per department (bar), (2) Student sign-ups over time – last 12 months (bar). Uses `useStudents`, `useDepartments`.
- **Other management pages**: Students, Lecturers, Courses, Semesters, Course-Semesters, Enrollment Sessions — list/detail/create/edit tables only; no overview/chart views.

---

## 1. Admin Dashboard (`/admin`)

Add a “View All Management” / overview section with small charts or summary cards so admins see trends at a glance without visiting each section.

| Idea                                 | Description                                                                                                   | Data source                                                                                                                               |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Entity counts trend**        | Mini sparklines or “vs last period” for Students, Lecturers, Courses (e.g. “+12 this semester”).          | Existing `useStudents`, `useLecturers`, `useCourses` (derive counts and, from `createdAt`, compare to previous period if needed). |
| **Enrollments snapshot**       | Card: total enrollments, optionally “this semester” if you filter by current semester.                      | `adminEnrollmentApi.getAll({ includeStudent: true, includeCourse: true })` (or existing admin enrollment hook if added).                |
| **Schedules / capacity**       | Card or tiny bar chart: number of course-semesters, or total capacity vs enrolled.                            | `useCourseSemesters()` (already has `_count.enrollments` if backend includes it), or derive from enrollments.                         |
| **Department distribution**    | Reuse or mirror “students per department” (compact bar or donut) so dashboard echoes Department > Overview. | Same as Department page:`useStudents`, `useDepartments`.                                                                              |
| **Enrollment sessions status** | List or badges: how many sessions are “open” vs “closed” for current/upcoming semesters.                  | `useEnrollmentSessions()`.                                                                                                              |

Suggested layout: keep existing stat cards and Quick Actions; add a second row or a single “Overview” card with 2–4 of the above (e.g. entity trend, enrollments snapshot, department distribution, enrollment sessions status).

---

## 2. Students (`/admin/management/student`)

| Idea                                 | Description                                                                             | Data source                                                               |
| ------------------------------------ | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Overview tab**               | Add a tab (e.g. “Overview” / “Charts”) alongside the table, similar to Departments. | `useStudents()`, optionally `useDepartments()`.                       |
| **Students by department**     | Bar chart: same as Department page “Total students by department”.                    | `useStudents()`, `useDepartments()` — aggregate by `departmentId`. |
| **Sign-ups over time**         | Bar/line: new students per month (e.g. last 12 months).                                 | `useStudents()` — group by `createdAt` month.                        |
| **Students by semester/level** | If students have a “level” or “recommended semester” field, bar chart by that.      | `useStudents()` — aggregate by that field.                             |

---

## 3. Lecturers (`/admin/management/lecturer`)

| Idea                             | Description                                                       | Data source                                                            |
| -------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Overview tab**           | “Overview” tab with one or two charts before the table.         | `useLecturers()`.                                                    |
| **Lecturers over time**    | Bar/line: new lecturers per month (e.g. last 12 months).          | `useLecturers()` — group by `createdAt`.                          |
| **Workload / assignments** | Bar chart: number of course-semesters (or sections) per lecturer. | `useCourseSemesters()` — include lecturer, count by `lecturerId`. |

---

## 4. Departments (`/admin/management/department`)

Already has Overview + Table. Optional additions:

| Idea                               | Description                                    | Data source                                        |
| ---------------------------------- | ---------------------------------------------- | -------------------------------------------------- |
| **Courses per department**   | Bar chart: course count per department.        | `useCourses()` — aggregate by `departmentId`. |
| **Lecturers per department** | If lecturers have `departmentId`, bar chart. | `useLecturers()` — aggregate by department.     |

---

## 5. Courses (`/admin/management/course`)

| Idea                            | Description                                                                | Data source                                        |
| ------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------- |
| **Overview tab**          | “Overview” + “Edit courses” (table) tabs.                              | `useCourses()`, `useDepartments()`.            |
| **Courses by department** | Bar chart: number of courses per department.                               | `useCourses()` — aggregate by `departmentId`. |
| **Credits distribution**  | Simple bar or histogram: number of courses by credit value (e.g. 3, 4, 6). | `useCourses()` — aggregate by `credits`.      |

---

## 6. Semesters (`/admin/management/semester`)

| Idea                                       | Description                                                     | Data source                                                                      |
| ------------------------------------------ | --------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Overview tab**                     | “Overview” + table tabs.                                      | `useSemesters()`, `useCourseSemesters()`, `useEnrollmentSessions()`.       |
| **Offerings per semester**           | Bar chart: number of course-semesters (offerings) per semester. | `useCourseSemesters()` — aggregate by `semesterId` (and include semesters). |
| **Enrollment sessions per semester** | Bar or list: how many sessions per semester (open/closed).      | `useEnrollmentSessions()` — group by semester.                                |

---

## 7. Course-Semesters (`/admin/management/course-semester`)

| Idea                        | Description                                                                    | Data source                                                                                              |
| --------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| **Overview tab**      | “Overview” + table tabs.                                                     | `useCourseSemesters()` with includes.                                                                  |
| **Schedules by day**  | Bar chart: count of course-semesters by day of week.                           | `useCourseSemesters()` — aggregate by `dayOfWeek`.                                                  |
| **Enrollment load**   | Bar chart: course-semesters with enrollment count (e.g. top 10 by enrollment). | `useCourseSemesters()` with `includeEnrollmentCount: true` if supported, or derive from enrollments. |
| **Lecturer workload** | Bar chart: number of course-semesters per lecturer.                            | `useCourseSemesters()` — include lecturer, aggregate by `lecturerId`.                               |

---

## 8. Enrollment Sessions (`/admin/management/enrollment-session`)

| Idea                           | Description                                                                           | Data source                                             |
| ------------------------------ | ------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| **Overview tab**         | “Overview” + table tabs.                                                            | `useEnrollmentSessions()`, `useSemesters()`.        |
| **Sessions by semester** | Bar or list: count of sessions per semester, optionally status (open/closed).         | `useEnrollmentSessions()` — group by `semesterId`. |
| **Timeline**             | Simple timeline or list of sessions by start/end date for current/upcoming semesters. | `useEnrollmentSessions()` — sort by date.            |

---

## 9. Enrollments (no dedicated page today)

The sidebar has “Enrollment Sessions” but not “Enrollments”. If you add an Enrollments management or overview area (e.g. under Management or as a dashboard widget):

| Idea                                | Description                                                                                                                                | Data source                                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| **Enrollments list page**     | Table: student, course, semester, grades (if any). Filters by semester, course, department.                                                | `adminEnrollmentApi.getAll({ includeStudent: true, includeCourse: true })`.                      |
| **Enrollments overview**      | Cards or charts: total enrollments; enrollments per semester; per course (top N).                                                          | Same API; aggregate in frontend by `courseOnSemester.semester.id`, `courseOnSemester.id`, etc. |
| **Grade summary (aggregate)** | For admin oversight: distribution of final grades (e.g. pass/fail or letter buckets) per course or per semester — no PII, aggregate only. | Same API; use `finalGrade` (and grade types if needed) to build histograms.                      |

---

## 10. Shared Patterns and Components

- **Tabs**: Reuse the pattern from Departments: “Overview” (charts) and “Edit / Table” so new chart views don’t clutter the table.
- **Charts**: Reuse the same library and patterns as `DepartmentStudentChart` (e.g. Recharts, `Card` + `CardHeader` + `CardContent`, `ResponsiveContainer`, tooltips). Consider a shared `AdminBarChart` or `AdminChartCard` wrapper for consistency.
- **Loading / empty**: Use the same loading and “no data” states as in `DepartmentStudentChart` (skeleton or “Loading chart data…”).
- **Navigation**: “View All Management Options” on the dashboard can link to a single “Management overview” page that hosts multiple small charts (entities, enrollments, sessions) if you prefer not to put all charts on the main dashboard.

---

## 11. Priority Order (suggestion)

1. **Dashboard**: Add 2–3 overview widgets (e.g. entity counts + department distribution + enrollment sessions status) so the TODO “Add some graph views for the View All Management” is addressed.
2. **Students**: Add Overview tab with “by department” and “sign-ups over time” (mirrors Department, high value).
3. **Courses**: Add Overview tab with “courses by department” (and optionally credits).
4. **Course-Semesters**: Add Overview tab with “by day” and “by lecturer” or enrollment load.
5. **Semesters** and **Enrollment Sessions**: Overview tabs with sessions/offerings per semester.
6. **Lecturers**: Overview tab (workload, sign-ups over time).
7. **Enrollments**: Dedicated list/overview page and aggregate grade views only if you need them; can follow after the above.

---

## 12. Out of Scope (for this doc)

- Lecturer or student-facing grade views (separate doc or feature set).
- New backend endpoints or new fields; all ideas above rely on existing APIs and response shapes.
- Exact chart types (bar vs line vs donut) — choose per page for clarity and consistency with `DepartmentStudentChart`.
