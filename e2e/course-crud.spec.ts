import { expect, test } from "@playwright/test";
import { expectAuthCookie, mockAdminSignIn } from "./fixtures/auth";

const MOCK_DEPARTMENTS = [
  { id: "dept-1", departmentId: "CS", name: "Computer Science" },
  { id: "dept-2", departmentId: "IT", name: "Information Technology" },
];

const MOCK_SEMESTERS = [
  {
    id: "sem-1",
    name: "Fall 2024",
    startDate: "2024-09-01",
    endDate: "2024-12-15",
    createdAt: "",
    updatedAt: "",
  },
];

const NEW_COURSE = {
  name: "E2E Test Course",
  credits: 3,
  departmentId: "dept-1",
  description: "E2E test course description",
};

const CREATED_COURSE = {
  id: "course-e2e-001",
  ...NEW_COURSE,
  departmentId: "dept-1",
  description: NEW_COURSE.description,
  recommendedSemester: null,
  department: { id: "dept-1", name: "Computer Science" },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const UPDATED_COURSE = { ...CREATED_COURSE, name: "E2E Updated" };

function setupApiMocks(page: import("@playwright/test").Page) {
  mockAdminSignIn(page);

  let coursesList = [CREATED_COURSE];

  page.route("**/api/admin/notification/admin-broadcast", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    }),
  );

  page.route("**/api/admin/department/all", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_DEPARTMENTS),
    }),
  );

  page.route("**/api/admin/semester/all", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_SEMESTERS),
    }),
  );

  page.route("**/api/admin/course/all*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(coursesList),
    }),
  );

  page.route("**/api/admin/course/find/*", (route) => {
    if (route.request().method() === "GET") {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(CREATED_COURSE),
      });
    } else {
      route.continue();
    }
  });

  page.route("**/api/admin/course/create", (route) => {
    if (route.request().method() === "POST") {
      route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(CREATED_COURSE),
      });
    } else {
      route.continue();
    }
  });

  page.route("**/api/admin/course/update/*", (route) => {
    coursesList = [UPDATED_COURSE];
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(UPDATED_COURSE),
    });
  });

  page.route("**/api/admin/course/delete/*", (route) =>
    route.fulfill({ status: 200, body: JSON.stringify({ message: "OK" }) }),
  );
}

test.describe("Course CRUD", () => {
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

  test("create course - form submit redirects to list and item appears", async ({
    page,
  }) => {
    await page.goto("/en/admin/management/course/create");

    await page.getByPlaceholder("Calculus I").fill(NEW_COURSE.name);
    await page.getByPlaceholder("3").fill(String(NEW_COURSE.credits));
    await page.getByRole("combobox", { name: /department/i }).click();
    await page.getByRole("option", { name: /computer science/i }).click();
    await page
      .getByPlaceholder("Describe the course...")
      .fill(NEW_COURSE.description);

    await page.getByRole("button", { name: /create course/i }).click();

    await expect(page).toHaveURL(/\/admin\/management\/course/);
    await page.goto("/en/admin/management/course?tab=edit-course");
    await expect(page.getByText(NEW_COURSE.name)).toBeVisible();
    await expect(page.getByText(String(NEW_COURSE.credits))).toBeVisible();
  });

  test("update course - edit and save", async ({ page }) => {
    await page.goto("/en/admin/management/course?tab=edit-course");

    await expect(page.getByText(NEW_COURSE.name)).toBeVisible();

    await page
      .getByRole("button", { name: /open menu|more/i })
      .first()
      .click();
    await page.getByRole("menuitem", { name: /edit/i }).click();

    await expect(page).toHaveURL(/\/admin\/management\/course\/course-e2e-001/);

    await page.getByPlaceholder("Calculus I").clear();
    await page.getByPlaceholder("Calculus I").fill("E2E Updated");

    const updateRequest = page.waitForRequest(
      (req) =>
        req.method() === "PATCH" && req.url().includes("/admin/course/update/"),
    );
    await page.getByRole("button", { name: /save|update/i }).click();

    await expect(page).toHaveURL(/\/admin\/management\/course/);
    const request = await updateRequest;
    expect(request.postDataJSON().name).toBe("E2E Updated");
  });

  test("delete course - open menu, confirm dialog, verify delete API called", async ({
    page,
  }) => {
    await page.goto("/en/admin/management/course?tab=edit-course");

    await expect(page.getByText(NEW_COURSE.name)).toBeVisible();

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
        req.url().includes("/admin/course/delete/"),
    );
    await page
      .getByRole("alertdialog")
      .getByRole("button", { name: /^delete$/i })
      .click({ force: true });

    await expect(deleteRequest).resolves.toBeDefined();
  });
});
