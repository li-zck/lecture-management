import { expect, test } from "@playwright/test";
import { mockStudentSignIn } from "./fixtures/auth";

const mockCourseList = [
  {
    id: "cs-offer-1",
    courseId: "course-1",
    semesterId: "sem-1",
    lecturerId: "lec-1",
    location: "Room 101",
    dayOfWeek: 1,
    startTime: 480,
    endTime: 570,
    capacity: 30,
    isSummarized: false,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    course: {
      id: "course-1",
      name: "Introduction to Programming",
      description: null,
      credits: 4,
      departmentId: "dept-1",
      recommendedSemester: null,
      department: { id: "dept-1", name: "Computer Science" },
    },
    semester: {
      id: "sem-1",
      name: "Fall 2025",
      startDate: "2025-01-01",
      endDate: "2025-05-31",
    },
    lecturer: {
      id: "lec-1",
      fullName: "Dr. Jane Smith",
      lecturerId: "LEC001",
      email: "jane@example.com",
    },
    _count: { enrollments: 5 },
  },
];

test.describe("Student Course Enrollment", () => {
  test("student signs in, browses courses, and enrolls", async ({ page }) => {
    await mockStudentSignIn(page);
    await page.route("**/api/course-semester/all*", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockCourseList),
      });
    });
    await page.route("**/api/enrollment/my-enrollments*", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });
    await page.route("**/api/enrollment/enroll", (route) => {
      if (route.request().method() === "POST") {
        route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({ id: "enroll-1", message: "Enrolled" }),
        });
      } else {
        route.continue();
      }
    });

    await page.goto("/en/sign-in");
    await page.getByPlaceholder(/enter your student id/i).fill("STU-CS-001");
    await page.locator('input[type="password"]').fill("student123");
    await page.getByRole("button", { name: "Sign In", exact: true }).click();

    await expect(page).toHaveURL(/\/my-courses/);
    await page.goto("/en/courses");

    await expect(page).toHaveURL(/\/courses/);
    await expect(
      page.getByRole("heading", { name: /course catalog/i }).first(),
    ).toBeVisible();

    await page
      .getByRole("row", { name: /introduction to programming/i })
      .click();

    await expect(
      page.getByRole("button", { name: /enroll in course/i }),
    ).toBeVisible();
    await page.getByRole("button", { name: /enroll in course/i }).click();

    await expect(
      page.getByText(/successfully enrolled in the course/i),
    ).toBeVisible({ timeout: 5000 });
  });
});
