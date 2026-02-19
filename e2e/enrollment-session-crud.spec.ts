import { expect, test } from "@playwright/test";
import { expectAuthCookie, mockAdminSignIn } from "./fixtures/auth";

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

const NEW_SESSION = {
  name: "E2E Early Registration",
  semesterId: "sem-1",
  startDate: "2025-09-01T08:00",
  endDate: "2025-09-15T23:59",
  isActive: true,
};

const CREATED_SESSION = {
  id: "es-e2e-001",
  name: NEW_SESSION.name,
  semesterId: NEW_SESSION.semesterId,
  startDate: "2025-09-01T08:00:00.000Z",
  endDate: "2025-09-15T23:59:00.000Z",
  isActive: true,
  semester: MOCK_SEMESTERS[0],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const UPDATED_SESSION = { ...CREATED_SESSION, name: "E2E Updated" };

function setupApiMocks(page: import("@playwright/test").Page) {
  mockAdminSignIn(page);

  let sessionsList = [CREATED_SESSION];

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
      body: JSON.stringify(MOCK_SEMESTERS),
    }),
  );

  page.route("**/api/admin/enrollment/session/all", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(sessionsList),
    }),
  );

  page.route("**/api/admin/enrollment/session/find/*", (route) => {
    if (route.request().method() === "GET") {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(CREATED_SESSION),
      });
    } else {
      route.continue();
    }
  });

  page.route("**/api/admin/enrollment/session/create", (route) => {
    if (route.request().method() === "POST") {
      sessionsList = [CREATED_SESSION];
      route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(CREATED_SESSION),
      });
    } else {
      route.continue();
    }
  });

  page.route("**/api/admin/enrollment/session/update/*", (route) => {
    sessionsList = [UPDATED_SESSION];
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(UPDATED_SESSION),
    });
  });

  page.route("**/api/admin/enrollment/session/delete/*", (route) =>
    route.fulfill({ status: 200, body: JSON.stringify({ message: "OK" }) }),
  );
}

test.describe("Enrollment Session CRUD", () => {
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

  test("create enrollment session - form submit goes back and item appears", async ({
    page,
  }) => {
    await page.goto(
      "/en/admin/management/enrollment-session?tab=edit-enrollment-session",
    );
    await page.goto("/en/admin/management/enrollment-session/create");

    await page
      .getByPlaceholder("e.g., Early Registration, Regular Enrollment")
      .fill(NEW_SESSION.name);
    await page.getByRole("combobox", { name: /semester/i }).click();
    await page.getByRole("option", { name: /fall 2025/i }).click();
    await page.getByLabel(/start date & time/i).fill(NEW_SESSION.startDate);
    await page.getByLabel(/end date & time/i).fill(NEW_SESSION.endDate);

    await page
      .getByRole("button", { name: /create enrollment session/i })
      .click();

    await expect(page).toHaveURL(/\/admin\/management\/enrollment-session/);
    await expect(page.getByText(NEW_SESSION.name)).toBeVisible();
  });

  test("update enrollment session - edit and save", async ({ page }) => {
    await page.goto(
      "/en/admin/management/enrollment-session?tab=edit-enrollment-session",
    );

    await expect(page.getByText(NEW_SESSION.name)).toBeVisible();

    await page
      .getByRole("button", { name: /open menu|more/i })
      .first()
      .click();
    await page.getByRole("menuitem", { name: /edit/i }).click();

    await expect(page).toHaveURL(
      /\/admin\/management\/enrollment-session\/es-e2e-001/,
    );

    await page
      .getByPlaceholder("e.g., Early Registration, Regular Enrollment")
      .clear();
    await page
      .getByPlaceholder("e.g., Early Registration, Regular Enrollment")
      .fill("E2E Updated");

    const updateRequest = page.waitForRequest(
      (req) =>
        req.method() === "PATCH" &&
        req.url().includes("/admin/enrollment/session/update/"),
    );
    await page.getByRole("button", { name: /save|update/i }).click();

    await expect(page).toHaveURL(/\/admin\/management\/enrollment-session/);
    const request = await updateRequest;
    expect(request.postDataJSON().name).toBe("E2E Updated");
  });

  test("delete enrollment session - open menu, confirm dialog, verify delete API called", async ({
    page,
  }) => {
    await page.goto(
      "/en/admin/management/enrollment-session?tab=edit-enrollment-session",
    );

    await expect(page.getByText(NEW_SESSION.name)).toBeVisible();

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
        req.url().includes("/admin/enrollment/session/delete/"),
    );
    await page
      .getByRole("alertdialog")
      .getByRole("button", { name: /^delete$/i })
      .click({ force: true });

    await expect(deleteRequest).resolves.toBeDefined();
  });
});
