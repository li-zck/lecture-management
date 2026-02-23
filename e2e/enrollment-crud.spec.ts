import { expect, test } from "@playwright/test";
import { expectAuthCookie, mockAdminSignIn } from "./fixtures/auth";

const CREATED_ENROLLMENT = {
  id: "enr-e2e-001",
  studentId: "stu-1",
  courseOnSemesterId: "cs-1",
  gradeType1: null,
  gradeType2: null,
  gradeType3: null,
  finalGrade: null,
  student: {
    id: "stu-1",
    studentId: "SV001",
    fullName: "E2E Test Student",
    email: "e2e@example.com",
  },
  courseOnSemester: {
    id: "cs-1",
    course: { id: "c1", name: "Calculus I", credits: 3 },
    semester: { id: "s1", name: "Fall 2025" },
    lecturer: null,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function setupApiMocks(page: import("@playwright/test").Page) {
  mockAdminSignIn(page);

  page.route("**/api/admin/notification/admin-broadcast", (route) =>
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
      body: JSON.stringify([CREATED_ENROLLMENT]),
    }),
  );

  page.route("**/api/admin/course/enrollment/delete/*", (route) =>
    route.fulfill({ status: 200, body: JSON.stringify({ message: "OK" }) }),
  );
}

test.describe("Enrollment CRUD", () => {
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

  test("list enrollments - table shows student and course", async ({
    page,
  }) => {
    await page.goto("/en/admin/management/enrollment?tab=edit-enrollment");

    await expect(page.getByText("E2E Test Student")).toBeVisible();
    await expect(page.getByText("Calculus I")).toBeVisible();
  });

  test("delete enrollment - open menu, confirm dialog, verify delete API called", async ({
    page,
  }) => {
    await page.goto("/en/admin/management/enrollment?tab=edit-enrollment");

    await expect(page.getByText("E2E Test Student")).toBeVisible();

    await page
      .getByRole("button", { name: /open menu|more/i })
      .first()
      .click();
    await page.getByRole("menuitem", { name: /delete/i }).click();

    const dialog = page.getByRole("alertdialog");
    await expect(dialog.getByText(/remove enrollment/i)).toBeVisible();

    const deleteRequest = page.waitForRequest(
      (req) =>
        req.method() === "DELETE" &&
        req.url().includes("/admin/course/enrollment/delete/"),
    );
    await dialog
      .getByRole("button", { name: /^delete$/i })
      .evaluate((el) => (el as HTMLButtonElement).click());

    await expect(deleteRequest).resolves.toBeDefined();
  });
});
