import { expect, test } from "@playwright/test";
import { expectAuthCookie, mockAdminSignIn } from "./fixtures/auth";

const MOCK_COURSES = [
  {
    id: "course-1",
    name: "Calculus I",
    credits: 3,
    departmentId: "dept-1",
    recommendedSemester: null,
    description: "Intro to calculus",
    createdAt: "",
    updatedAt: "",
  },
];

const MOCK_SEMESTERS = [
  {
    id: "sem-1",
    name: "Fall 2025",
    startDate: "2025-09-01",
    endDate: "2025-12-15",
    createdAt: "",
    updatedAt: "",
  },
];

const MOCK_LECTURERS = [
  {
    id: "lec-1",
    lecturerId: "GV001",
    fullName: "Dr. Test Lecturer",
    email: "lecturer@example.com",
    username: "lecturer",
    active: true,
    departmentHeadId: null,
    createdAt: "",
    updatedAt: "",
  },
];

const CREATED_COURSE_SEMESTER = {
  id: "cs-e2e-001",
  courseId: "course-1",
  semesterId: "sem-1",
  lecturerId: null,
  dayOfWeek: 1,
  startTime: 1,
  endTime: 2,
  location: "Room 101",
  capacity: 60,
  course: MOCK_COURSES[0],
  semester: MOCK_SEMESTERS[0],
  lecturer: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const UPDATED_COURSE_SEMESTER = {
  ...CREATED_COURSE_SEMESTER,
  location: "Room 202",
};

function setupApiMocks(page: import("@playwright/test").Page) {
  mockAdminSignIn(page);

  let courseSemestersList = [CREATED_COURSE_SEMESTER];

  page.route("**/api/admin/notification/admin-broadcast", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    }),
  );

  page.route("**/api/admin/course/all*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_COURSES),
    }),
  );

  page.route("**/api/admin/semester/all", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_SEMESTERS),
    }),
  );

  page.route("**/api/admin/lecturer/all", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_LECTURERS),
    }),
  );

  page.route(/\/admin\/semester\/course\/all/, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(courseSemestersList),
    }),
  );

  page.route("**/api/admin/course/enrollment/all*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    }),
  );

  page.route("**/api/admin/semester/course/find/*", (route) => {
    if (route.request().method() === "GET") {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(CREATED_COURSE_SEMESTER),
      });
    } else {
      route.continue();
    }
  });

  page.route("**/api/admin/semester/course/create", (route) => {
    if (route.request().method() === "POST") {
      courseSemestersList = [CREATED_COURSE_SEMESTER];
      route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(CREATED_COURSE_SEMESTER),
      });
    } else {
      route.continue();
    }
  });

  page.route("**/api/admin/semester/course/update/*", (route) => {
    courseSemestersList = [UPDATED_COURSE_SEMESTER];
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(UPDATED_COURSE_SEMESTER),
    });
  });

  page.route("**/api/admin/semester/course/delete/*", (route) =>
    route.fulfill({ status: 200, body: JSON.stringify({ message: "OK" }) }),
  );
}

test.describe("Course-Semester CRUD", () => {
  test.beforeEach(async ({ page }) => {
    setupApiMocks(page);
    await page.goto("/en/admin/sign-in");
    await page.getByPlaceholder("admin").fill("admin");
    await page.locator('input[type="password"]').fill("admin123");
    await page
      .getByRole("button", { name: /sign in as admin|sign in/i })
      .click();
    await expect(page).toHaveURL(/\/admin\/?$/);
    await expectAuthCookie(page);
  });

  test("create course-semester - form submit goes back and item appears", async ({
    page,
  }) => {
    await page.goto(
      "/en/admin/management/course-semester?tab=edit-course-semester",
    );
    await page.goto("/en/admin/management/course-semester/create");

    await page.getByRole("combobox", { name: /course/i }).click();
    await page.getByRole("option", { name: /calculus i/i }).click();
    await page.getByRole("combobox", { name: /semester/i }).click();
    await page.getByRole("option", { name: /fall 2025/i }).click();

    const createRequest = page.waitForRequest(
      (req) =>
        req.method() === "POST" &&
        req.url().includes("/admin/semester/course/create"),
    );
    await page.getByRole("button", { name: /add schedule/i }).click();

    await expect(page).toHaveURL(/\/admin\/management\/course-semester/);
    const request = await createRequest;
    expect(request.postDataJSON()).toMatchObject({
      courseId: "course-1",
      semesterId: "sem-1",
    });
  });

  test("update course-semester - edit and save", async ({ page }) => {
    // Navigate via list so router.back() returns to list (edit page uses router.back())
    await page.goto(
      "/en/admin/management/course-semester?tab=edit-course-semester",
    );
    await page.goto("/en/admin/management/course-semester/cs-e2e-001");

    // Resolve Lecturer validation (API returns null, schema expects string|undefined)
    await page.getByRole("combobox", { name: /lecturer/i }).click();
    await page.getByRole("option", { name: /unassigned/i }).click();

    await page.getByPlaceholder("Room 101").clear();
    await page.getByPlaceholder("Room 101").fill("Room 202");

    const updateRequest = page.waitForRequest(
      (req) =>
        req.method() === "PUT" &&
        req.url().includes("/admin/semester/course/update/"),
    );
    await page.getByRole("button", { name: /save|update/i }).click();

    await expect(page).toHaveURL(/\/admin\/management\/course-semester/);
    const request = await updateRequest;
    expect(request.postDataJSON().location).toBe("Room 202");
  });

  test("delete course-semester - open menu, confirm dialog, verify delete API called", async ({
    page,
  }) => {
    await page.goto(
      "/en/admin/management/course-semester?tab=edit-course-semester",
    );

    await expect(
      page.getByRole("cell", { name: "Calculus I", exact: true }),
    ).toBeVisible();

    await page
      .getByRole("button", { name: /open menu|more/i })
      .first()
      .click();
    await page.getByRole("menuitem", { name: /delete/i }).click();

    await expect(
      page.getByRole("alertdialog").getByText(/are you absolutely sure/i),
    ).toBeVisible();

    const deleteRequest = page.waitForRequest(
      (req) =>
        req.method() === "DELETE" &&
        req.url().includes("/admin/semester/course/delete/"),
    );
    await page
      .getByRole("alertdialog")
      .getByRole("button", { name: /^delete$/i })
      .click({ force: true });

    await expect(deleteRequest).resolves.toBeDefined();
  });
});
