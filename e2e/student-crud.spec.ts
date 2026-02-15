import { expect, test } from "@playwright/test";
import { expectAuthCookie, mockAdminSignIn } from "./fixtures/auth";

const MOCK_DEPARTMENTS = [
  { id: "dept-1", departmentId: "CS", name: "Computer Science" },
  { id: "dept-2", departmentId: "IT", name: "Information Technology" },
];

const NEW_STUDENT = {
  fullName: "E2E Test Student",
  studentId: "STU-E2E-001",
  email: "e2e.test@university.edu",
  username: "e2e_test_student",
  password: "TestPass123",
  departmentId: "dept-1",
  citizenId: "CID-E2E-001",
  phone: "+84901234567",
  gender: true,
  birthDate: "2000-01-15",
};

const CREATED_STUDENT = {
  id: "student-e2e-001",
  ...NEW_STUDENT,
  department: { id: "dept-1", name: "Computer Science" },
  active: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function setupApiMocks(page: import("@playwright/test").Page) {
  mockAdminSignIn(page);

  page.route("**/api/admin/department/all", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_DEPARTMENTS),
    }),
  );

  page.route("**/api/admin/student/all", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([CREATED_STUDENT]),
    }),
  );

  page.route("**/api/admin/student/create", (route) => {
    if (route.request().method() === "POST") {
      route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(CREATED_STUDENT),
      });
    } else {
      route.continue();
    }
  });

  page.route("**/api/admin/student/update/*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ...CREATED_STUDENT, fullName: "E2E Updated" }),
    }),
  );

  page.route("**/api/admin/student/delete/*", (route) =>
    route.fulfill({ status: 200, body: "" }),
  );
}

test.describe("Student CRUD", () => {
  test.beforeEach(async ({ page }) => {
    setupApiMocks(page);
    await page.goto("/en/admin/sign-in");
    await page.getByLabel("Username").fill("admin");
    await page.getByLabel("Password", { exact: true }).fill("admin123");
    await page
      .getByRole("button", { name: /sign in as admin|sign in/i })
      .click();
    await expect(page).toHaveURL(/\/admin\/?$/);
    await expectAuthCookie(page);
  });

  test("create student - form submit redirects to list and item appears", async ({
    page,
  }) => {
    await page.goto("/en/admin/management/student/create");

    await page.getByLabel("Full Name").fill(NEW_STUDENT.fullName);
    await page.getByLabel("Student ID").fill(NEW_STUDENT.studentId);
    await page.getByLabel("Email").fill(NEW_STUDENT.email);
    await page.getByLabel("Username").fill(NEW_STUDENT.username);
    await page
      .getByLabel("Password", { exact: true })
      .fill(NEW_STUDENT.password);
    await page.getByRole("combobox", { name: /department/i }).click();
    await page.getByRole("option", { name: /computer science/i }).click();
    await page.getByLabel("Citizen ID").fill(NEW_STUDENT.citizenId);
    await page.getByLabel("Phone").fill(NEW_STUDENT.phone);
    await page.getByLabel("Birth date").fill("January 15, 2000");

    await page.getByRole("button", { name: /create student/i }).click();

    await expect(page).toHaveURL(/\/admin\/management\/student/);
    await expect(page.getByText(NEW_STUDENT.fullName)).toBeVisible();
    await expect(page.getByText(NEW_STUDENT.studentId)).toBeVisible();
  });

  test("update student - edit and save", async ({ page }) => {
    await page.goto("/en/admin/management/student");

    await expect(page.getByText(NEW_STUDENT.fullName)).toBeVisible();

    await page
      .getByRole("button", { name: /open menu|more/i })
      .first()
      .click();
    await page.getByRole("menuitem", { name: /edit/i }).click();

    await expect(page).toHaveURL(
      /\/admin\/management\/student\/student-e2e-001/,
    );

    await page.getByLabel("Full Name").clear();
    await page.getByLabel("Full Name").fill("E2E Updated");

    await page.getByRole("button", { name: /save|update/i }).click();

    await expect(page).toHaveURL(/\/admin\/management\/student/);
    await expect(page.getByText("E2E Updated")).toBeVisible();
  });

  test("delete student - open menu, confirm dialog, verify delete API called", async ({
    page,
  }) => {
    await page.goto("/en/admin/management/student");

    await expect(page.getByText(NEW_STUDENT.fullName)).toBeVisible();

    await page
      .getByRole("button", { name: /open menu|more/i })
      .first()
      .click();
    await page.getByRole("menuitem", { name: /delete/i }).click();

    await expect(
      page.getByRole("dialog").getByText(/are you absolutely sure/i),
    ).toBeVisible();

    const deleteRequest = page.waitForRequest(
      (req) =>
        req.method() === "DELETE" &&
        req.url().includes("/admin/student/delete/"),
    );
    await page.getByRole("button", { name: /^delete$/i }).click();

    await expect(deleteRequest).resolves.toBeDefined();
  });
});
