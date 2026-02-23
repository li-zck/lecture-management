import { expect, test } from "@playwright/test";
import { expectAuthCookie, mockAdminSignIn } from "./fixtures/auth";

const MOCK_DEPARTMENTS = [
  { id: "dept-1", departmentId: "CS", name: "Computer Science" },
  { id: "dept-2", departmentId: "IT", name: "Information Technology" },
];

const NEW_LECTURER = {
  fullName: "E2E Test Lecturer",
  lecturerId: "LEC-E2E-001",
  email: "e2e.lecturer@university.edu",
  username: "e2e_test_lecturer",
  password: "TestPass123",
};

const CREATED_LECTURER = {
  id: "lecturer-e2e-001",
  ...NEW_LECTURER,
  active: true,
  departmentHeadId: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const UPDATED_LECTURER = { ...CREATED_LECTURER, fullName: "E2E Updated" };

function setupApiMocks(page: import("@playwright/test").Page) {
  mockAdminSignIn(page);

  let lecturersList = [CREATED_LECTURER];

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

  page.route("**/api/admin/lecturer/all", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(lecturersList),
    }),
  );

  page.route("**/api/admin/lecturer/find/*", (route) => {
    if (route.request().method() === "GET") {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(CREATED_LECTURER),
      });
    } else {
      route.continue();
    }
  });

  page.route("**/api/admin/lecturer/create", (route) => {
    if (route.request().method() === "POST") {
      route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(CREATED_LECTURER),
      });
    } else {
      route.continue();
    }
  });

  page.route("**/api/admin/lecturer/update/*", (route) => {
    lecturersList = [UPDATED_LECTURER];
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(UPDATED_LECTURER),
    });
  });

  page.route("**/api/admin/lecturer/delete/*", (route) =>
    route.fulfill({ status: 200, body: JSON.stringify({ message: "OK" }) }),
  );
}

test.describe("Lecturer CRUD", () => {
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

  test("create lecturer - form submit redirects to list and item appears", async ({
    page,
  }) => {
    await page.goto("/en/admin/management/lecturer/create");

    await page.getByPlaceholder("Dr. Nguyen Van B").fill(NEW_LECTURER.fullName);
    await page.getByPlaceholder("GV123").fill(NEW_LECTURER.lecturerId);
    await page.getByPlaceholder("b@example.com").fill(NEW_LECTURER.email);
    await page.getByPlaceholder("username").fill(NEW_LECTURER.username);
    await page.locator('input[type="password"]').fill(NEW_LECTURER.password);

    await page.getByRole("button", { name: /create lecturer/i }).click();

    await expect(page).toHaveURL(/\/admin\/management\/lecturer/);
    await page.getByRole("button", { name: /edit lecturers/i }).click();
    await expect(page.getByText(NEW_LECTURER.fullName)).toBeVisible();
    await expect(page.getByText(NEW_LECTURER.lecturerId)).toBeVisible();
  });

  test("update lecturer - edit and save", async ({ page }) => {
    await page.goto("/en/admin/management/lecturer?tab=edit-lecturer");

    await expect(page.getByText(NEW_LECTURER.fullName)).toBeVisible();

    await page
      .getByRole("button", { name: /open menu|more/i })
      .first()
      .click();
    await page.getByRole("menuitem", { name: /edit/i }).click();

    await expect(page).toHaveURL(
      /\/admin\/management\/lecturer\/lecturer-e2e-001/,
    );

    await page.getByPlaceholder("Dr. Nguyen Van B").clear();
    await page.getByPlaceholder("Dr. Nguyen Van B").fill("E2E Updated");

    await page.getByRole("button", { name: /save|update/i }).click();

    await expect(page).toHaveURL(/\/admin\/management\/lecturer/);
    await page.getByRole("button", { name: /edit lecturers/i }).click();
    await expect(page.getByText("E2E Updated")).toBeVisible();
  });

  test("delete lecturer - open menu, confirm dialog, verify delete API called", async ({
    page,
  }) => {
    await page.goto("/en/admin/management/lecturer?tab=edit-lecturer");

    await expect(page.getByText(NEW_LECTURER.fullName)).toBeVisible();

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
        req.url().includes("/admin/lecturer/delete/"),
    );
    await page
      .getByRole("alertdialog")
      .getByRole("button", { name: /^delete$/i })
      .click({ force: true });

    await expect(deleteRequest).resolves.toBeDefined();
  });
});
