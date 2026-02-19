import { expect, test } from "@playwright/test";
import {
  expectAuthCookie,
  mockLecturerSignIn,
  mockStudentSignIn,
} from "./fixtures/auth";

test.describe("Post-login smoke tests", () => {
  test.describe("Student", () => {
    test("after sign-in, my-courses page loads and shows content", async ({
      page,
    }) => {
      mockStudentSignIn(page);
      page.route("**/api/enrollment/my-enrollments*", (route) =>
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([]),
        }),
      );

      await page.goto("/en/sign-in");
      await page.getByPlaceholder(/enter your student id/i).fill("STU-001");
      await page.locator('input[type="password"]').fill("student123");
      await page.getByRole("button", { name: "Sign In", exact: true }).click();

      await expect(page).toHaveURL(/\/my-courses/);
      await expectAuthCookie(page);
      await expect(
        page.getByRole("heading", { name: /my courses/i }),
      ).toBeVisible();
    });
  });

  test.describe("Lecturer", () => {
    test("after sign-in, my-courses page loads and shows content", async ({
      page,
    }) => {
      mockLecturerSignIn(page);
      page.route("**/api/course-semester/lecturer/my-courses*", (route) =>
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([]),
        }),
      );

      await page.goto("/en/sign-in");
      await page.getByRole("button", { name: /lecturer/i }).click();
      await page.getByPlaceholder(/enter your lecturer id/i).fill("LEC-001");
      await page.locator('input[type="password"]').fill("lecturer123");
      await page.getByRole("button", { name: "Sign In", exact: true }).click();

      await expect(page).toHaveURL(/\/my-courses/);
      await expectAuthCookie(page);
      await expect(
        page.getByRole("heading", { name: /my courses/i }),
      ).toBeVisible();
    });
  });
});
