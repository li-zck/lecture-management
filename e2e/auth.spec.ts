import { expect } from "@playwright/test";
import {
  expectAuthCookie,
  mockAdminSignIn,
  mockAdminSignUp,
  mockLecturerSignIn,
  mockStudentSignIn,
  test,
} from "./fixtures/auth";

test.describe("Auth Flow", () => {
  test.describe("Student Sign-In", () => {
    test("visits sign-in page and displays form", async ({ page }) => {
      await page.goto("/en/sign-in");

      await expect(page).toHaveURL(/\/en\/sign-in/);
      await expect(
        page.getByRole("heading", { name: /welcome back/i }),
      ).toBeVisible();
      await expect(
        page.getByLabel(/student id/i).or(page.getByLabel(/identifier/i)),
      ).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
      await expect(
        page.getByRole("button", { name: /sign in/i }).first(),
      ).toBeVisible();
    });

    test("fills identifier + password, submits, redirects to my-courses", async ({
      page,
    }) => {
      await mockStudentSignIn(page);
      await page.goto("/en/sign-in");

      await page.getByLabel(/student id/i).fill("STU-CS-001");
      await page.getByLabel(/password/i).fill("student123");
      await page
        .getByRole("button", { name: /sign in/i })
        .first()
        .click();

      await expect(page).toHaveURL(/\/my-courses/);
      await expectAuthCookie(page);
    });
  });

  test.describe("Lecturer Sign-In", () => {
    test("fills identifier + password, submits, redirects to my-courses", async ({
      page,
    }) => {
      await mockLecturerSignIn(page);
      await page.goto("/en/sign-in");

      await page.getByRole("button", { name: /lecturer/i }).click();
      await page.getByLabel(/lecturer id/i).fill("LEC-001");
      await page.getByLabel(/password/i).fill("lecturer123");
      await page
        .getByRole("button", { name: /sign in/i })
        .first()
        .click();

      await expect(page).toHaveURL(/\/my-courses/);
      await expectAuthCookie(page);
    });
  });

  test.describe("Admin Sign-Up", () => {
    test("visits admin sign-up page and creates account", async ({ page }) => {
      await mockAdminSignUp(page);
      await page.goto("/en/admin/sign-up");

      await expect(page).toHaveURL(/\/admin\/sign-up/);
      await expect(
        page.getByText(/create admin account/i).first(),
      ).toBeVisible();

      await page.getByPlaceholder("admin").fill("newadmin");
      await page
        .getByLabel(/password/i)
        .first()
        .fill("password123");
      await page.getByLabel(/confirm/i).fill("password123");
      await page.getByRole("button", { name: /create account/i }).click();

      await expect(page).toHaveURL(/\/admin\/?$/);
      await expectAuthCookie(page);
    });
  });

  test.describe("Admin Sign-In", () => {
    test("visits admin sign-in page", async ({ page }) => {
      await page.goto("/en/admin/sign-in");

      await expect(page).toHaveURL(/\/admin\/sign-in/);
      await expect(page.getByText(/admin access/i).first()).toBeVisible();
      await expect(page.getByPlaceholder("admin")).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
    });

    test("fills username + password, submits, redirects to admin dashboard", async ({
      page,
    }) => {
      await mockAdminSignIn(page);
      await page.goto("/en/admin/sign-in");

      await page.getByPlaceholder("admin").fill("admin");
      await page.getByLabel(/password/i).fill("admin123");
      await page
        .getByRole("button", { name: /sign in as admin|sign in/i })
        .click();

      await expect(page).toHaveURL(/\/admin\/?$/);
      await expectAuthCookie(page);
      await expect(
        page.getByRole("heading", { level: 1, name: /dashboard/i }),
      ).toBeVisible();
    });
  });
});
