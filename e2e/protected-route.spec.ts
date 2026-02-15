import { expect, test } from "@playwright/test";

test.describe("Protected Routes", () => {
  test("unauthenticated access to /dashboard redirects to sign-in", async ({
    page,
  }) => {
    await page.goto("/en/dashboard");

    await expect(page).toHaveURL(/\/sign-in/);
  });

  test("unauthenticated access to /en/courses redirects to sign-in", async ({
    page,
  }) => {
    await page.goto("/en/courses");

    await expect(page).toHaveURL(/\/sign-in/);
  });

  test("unauthenticated access to /admin redirects to admin sign-in", async ({
    page,
  }) => {
    await page.goto("/en/admin");

    await expect(page).toHaveURL(/\/admin\/sign-in/);
  });

  test("unauthenticated access to /admin/management/student redirects to admin sign-in", async ({
    page,
  }) => {
    await page.goto("/en/admin/management/student");

    await expect(page).toHaveURL(/\/admin\/sign-in/);
  });
});
