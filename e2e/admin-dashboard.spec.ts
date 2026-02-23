import { expect, test } from "@playwright/test";
import { expectAuthCookie, mockAdminSignIn } from "./fixtures/auth";

function setupApiMocks(page: import("@playwright/test").Page) {
  mockAdminSignIn(page);

  page.route("**/api/admin/notification/admin-broadcast", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    }),
  );
  page.route("**/api/admin/student/all*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([{ id: "s1", studentId: "SV001" }]),
    }),
  );
  page.route("**/api/admin/lecturer/all", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([{ id: "l1", lecturerId: "GV001" }]),
    }),
  );
  page.route("**/api/admin/department/all", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([{ id: "d1", name: "CS" }]),
    }),
  );
  page.route("**/api/admin/course/all*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([{ id: "c1", name: "Calculus" }]),
    }),
  );
  page.route("**/api/admin/semester/all", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([{ id: "sem1", name: "Fall 2025" }]),
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
  page.route("**/api/admin/course/enrollment/all*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    }),
  );
}

test.describe("Admin Dashboard", () => {
  test("authenticated admin sees dashboard with stats and navigation", async ({
    page,
  }) => {
    setupApiMocks(page);
    await page.goto("/en/admin/sign-in");
    await page.getByPlaceholder("admin").fill("admin");
    await page.locator('input[type="password"]').fill("admin123");
    await page
      .getByRole("button", { name: /sign in as admin|sign in/i })
      .click();

    await expect(page).toHaveURL(/\/admin\/?$/);
    await expectAuthCookie(page);
    await expect(
      page.getByRole("heading", { name: /admin|dashboard/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Students.*Active students/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Lecturers.*Faculty/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Departments.*Academic departments/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Courses.*Available courses/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Semesters.*Academic terms/i }),
    ).toBeVisible();
  });
});
