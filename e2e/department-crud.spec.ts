import { expect, test } from "@playwright/test";
import { expectAuthCookie, mockAdminSignIn } from "./fixtures/auth";

const MOCK_LECTURERS = [
  {
    id: "lec-1",
    lecturerId: "GV001",
    fullName: "Dr. Nguyen Van A",
    email: "a@example.com",
    username: "lecturer_a",
    active: true,
    departmentHeadId: null,
    createdAt: "",
    updatedAt: "",
  },
];

const NEW_DEPARTMENT = {
  name: "E2E Test Department",
  departmentId: "E2E",
};

const CREATED_DEPARTMENT = {
  id: "dept-e2e-001",
  ...NEW_DEPARTMENT,
  description: null,
  headId: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const UPDATED_DEPARTMENT = { ...CREATED_DEPARTMENT, name: "E2E Updated" };

function setupApiMocks(page: import("@playwright/test").Page) {
  mockAdminSignIn(page);

  let departmentsList = [CREATED_DEPARTMENT];

  page.route("**/api/admin/notification/admin-broadcast", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    }),
  );

  page.route("**/api/admin/lecturer/all", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_LECTURERS),
    }),
  );

  page.route("**/api/admin/student/all", (route) =>
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
      body: JSON.stringify(departmentsList),
    }),
  );

  page.route("**/api/admin/department/find/*", (route) => {
    if (route.request().method() === "GET") {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(CREATED_DEPARTMENT),
      });
    } else {
      route.continue();
    }
  });

  page.route("**/api/admin/department/create", (route) => {
    if (route.request().method() === "POST") {
      route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(CREATED_DEPARTMENT),
      });
    } else {
      route.continue();
    }
  });

  page.route("**/api/admin/department/update/*", (route) => {
    departmentsList = [UPDATED_DEPARTMENT];
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(UPDATED_DEPARTMENT),
    });
  });

  page.route("**/api/admin/department/delete/*", (route) =>
    route.fulfill({ status: 200, body: JSON.stringify({ message: "OK" }) }),
  );
}

test.describe("Department CRUD", () => {
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

  test("create department - form submit redirects to list and item appears", async ({
    page,
  }) => {
    await page.goto("/en/admin/management/department/create");

    await page
      .getByPlaceholder("Software Engineering")
      .fill(NEW_DEPARTMENT.name);
    await page.getByPlaceholder("SE").fill(NEW_DEPARTMENT.departmentId);

    await page.getByRole("button", { name: /create department/i }).click();

    await expect(page).toHaveURL(/\/admin\/management\/department/);
    await page.goto("/en/admin/management/department?tab=edit-department");
    await expect(page.getByText(NEW_DEPARTMENT.name)).toBeVisible();
    await expect(
      page.getByRole("cell", {
        name: NEW_DEPARTMENT.departmentId,
        exact: true,
      }),
    ).toBeVisible();
  });

  test("update department - edit and save", async ({ page }) => {
    await page.goto("/en/admin/management/department?tab=edit-department");

    await expect(page.getByText(NEW_DEPARTMENT.name)).toBeVisible();

    await page
      .getByRole("button", { name: /open menu|more/i })
      .first()
      .click();
    await page.getByRole("menuitem", { name: /edit/i }).click();

    await expect(page).toHaveURL(
      /\/admin\/management\/department\/dept-e2e-001/,
    );

    await page.getByPlaceholder("Software Engineering").clear();
    await page.getByPlaceholder("Software Engineering").fill("E2E Updated");
    await page
      .getByPlaceholder("Describe the department...")
      .fill("E2E test description");

    const updateRequest = page.waitForRequest(
      (req) =>
        req.method() === "PATCH" &&
        req.url().includes("/admin/department/update/"),
    );
    await page.getByRole("button", { name: /save|update/i }).click();

    await expect(page).toHaveURL(/\/admin\/management\/department/);
    const request = await updateRequest;
    expect(request.postDataJSON().name).toBe("E2E Updated");
  });

  test("delete department - open menu, confirm dialog, verify delete API called", async ({
    page,
  }) => {
    await page.goto("/en/admin/management/department?tab=edit-department");

    await expect(page.getByText(NEW_DEPARTMENT.name)).toBeVisible();

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
        req.url().includes("/admin/department/delete/"),
    );
    await page
      .getByRole("alertdialog")
      .getByRole("button", { name: /^delete$/i })
      .click();

    await expect(deleteRequest).resolves.toBeDefined();
  });
});
