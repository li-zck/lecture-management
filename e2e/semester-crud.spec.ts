import { expect, test } from "@playwright/test";
import { expectAuthCookie, mockAdminSignIn } from "./fixtures/auth";

const NEW_SEMESTER = {
  name: "E2E Fall 2025",
  startDate: "2025-09-01",
  endDate: "2025-12-15",
};

const CREATED_SEMESTER = {
  id: "sem-e2e-001",
  ...NEW_SEMESTER,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const UPDATED_SEMESTER = { ...CREATED_SEMESTER, name: "E2E Updated" };

function setupApiMocks(page: import("@playwright/test").Page) {
  mockAdminSignIn(page);

  let semestersList = [CREATED_SEMESTER];

  page.route("**/api/admin/notification/admin-broadcast", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    }),
  );

  page.route("**/api/admin/semester/all", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(semestersList),
    }),
  );

  page.route("**/api/admin/semester/course/all", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    }),
  );

  page.route("**/api/admin/enrollment/session/all", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    }),
  );

  page.route("**/api/admin/semester/find/*", (route) => {
    if (route.request().method() === "GET") {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(CREATED_SEMESTER),
      });
    } else {
      route.continue();
    }
  });

  page.route("**/api/admin/semester/create", (route) => {
    if (route.request().method() === "POST") {
      semestersList = [CREATED_SEMESTER];
      route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(CREATED_SEMESTER),
      });
    } else {
      route.continue();
    }
  });

  page.route("**/api/admin/semester/update/*", (route) => {
    semestersList = [UPDATED_SEMESTER];
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(UPDATED_SEMESTER),
    });
  });

  page.route("**/api/admin/semester/delete/*", (route) =>
    route.fulfill({ status: 200, body: JSON.stringify({ message: "OK" }) }),
  );
}

test.describe("Semester CRUD", () => {
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

  test("create semester - form submit redirects to list and item appears", async ({
    page,
  }) => {
    await page.goto("/en/admin/management/semester/create");

    await page.getByPlaceholder("Spring 2026").fill(NEW_SEMESTER.name);
    await page.getByPlaceholder("Select start date").fill("09/01/2025");
    await page.getByPlaceholder("Select end date").fill("12/15/2025");

    await page.getByRole("button", { name: /create semester/i }).click();

    await expect(page).toHaveURL(/\/admin\/management\/semester/);
    await page.goto("/en/admin/management/semester?tab=edit-semester");
    await expect(page.getByText(NEW_SEMESTER.name)).toBeVisible();
  });

  test("update semester - edit and save", async ({ page }) => {
    await page.goto("/en/admin/management/semester?tab=edit-semester");

    await expect(page.getByText(NEW_SEMESTER.name)).toBeVisible();

    await page
      .getByRole("button", { name: /open menu|more/i })
      .first()
      .click();
    await page.getByRole("menuitem", { name: /edit/i }).click();

    await expect(page).toHaveURL(/\/admin\/management\/semester\/sem-e2e-001/);

    await page.getByPlaceholder("Spring 2026").clear();
    await page.getByPlaceholder("Spring 2026").fill("E2E Updated");

    const updateRequest = page.waitForRequest(
      (req) =>
        req.method() === "PATCH" &&
        req.url().includes("/admin/semester/update/"),
    );
    await page.getByRole("button", { name: /save|update/i }).click();

    await expect(page).toHaveURL(/\/admin\/management\/semester/);
    const request = await updateRequest;
    expect(request.postDataJSON().name).toBe("E2E Updated");
  });

  test("delete semester - open menu, confirm dialog, verify delete API called", async ({
    page,
  }) => {
    await page.goto("/en/admin/management/semester?tab=edit-semester");

    await expect(page.getByText(NEW_SEMESTER.name)).toBeVisible();

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
        req.url().includes("/admin/semester/delete/"),
    );
    await page
      .getByRole("alertdialog")
      .getByRole("button", { name: /^delete$/i })
      .click({ force: true });

    await expect(deleteRequest).resolves.toBeDefined();
  });
});
