import { expect, test } from "@playwright/test";
import {
  expectAuthCookie,
  mockAdminSignIn,
  mockLecturerSignIn,
  mockStudentSignIn,
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
        page.getByLabel(/student id|username/i).first(),
      ).toBeVisible();
      await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
      await expect(
        page.getByRole("button", { name: /sign in/i }),
      ).toBeVisible();
    });

    test("fills identifier + password, submits, redirects to my-courses", async ({
      page,
    }) => {
      await mockStudentSignIn(page);
      await page.goto("/en/sign-in");

      await page
        .getByLabel(/student id|username/i)
        .first()
        .fill("STU-CS-001");
      await page.getByLabel("Password", { exact: true }).fill("student123");
      await page.getByRole("button", { name: /sign in/i }).click();

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
      await page
        .getByLabel(/lecturer id|username/i)
        .first()
        .fill("LEC-001");
      await page.getByLabel("Password", { exact: true }).fill("lecturer123");
      await page.getByRole("button", { name: /sign in/i }).click();

      await expect(page).toHaveURL(/\/my-courses/);
      await expectAuthCookie(page);
    });
  });

  test.describe("Admin Sign-In", () => {
    test("visits admin sign-in page", async ({ page }) => {
      await page.goto("/en/admin/sign-in");

      await expect(page).toHaveURL(/\/admin\/sign-in/);
      await expect(
        page.getByRole("heading", { name: /admin access/i }),
      ).toBeVisible();
      await expect(page.getByLabel("Username")).toBeVisible();
      await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
    });

    test("fills username + password, submits, redirects to admin dashboard", async ({
      page,
    }) => {
      await mockAdminSignIn(page);
      await page.goto("/en/admin/sign-in");

      await page.getByLabel("Username").fill("admin");
      await page.getByLabel("Password", { exact: true }).fill("admin123");
      await page
        .getByRole("button", { name: /sign in as admin|sign in/i })
        .click();

      await expect(page).toHaveURL(/\/admin\/?$/);
      await expectAuthCookie(page);
      await expect(
        page.getByRole("heading", { name: /admin|dashboard/i }),
      ).toBeVisible();
    });
  });
});
