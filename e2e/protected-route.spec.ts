import { expect, test } from "@playwright/test";

test.describe("Protected Routes", () => {
  test("unauthenticated access to /dashboard shows sign-in required or redirects", async ({
    page,
  }) => {
    await page.goto("/en/dashboard");
    await page.waitForLoadState("networkidle");

    // Either redirect to sign-in, or dashboard shows "unauthorized" / "sign in to view"
    const url = page.url();
    if (url.includes("/sign-in")) {
      await expect(page).toHaveURL(/\/sign-in/);
    } else {
      await expect(
        page.getByText(/unauthorized|please sign in to view/i).first(),
      ).toBeVisible();
    }
  });

  test("unauthenticated access to /en/courses shows sign-in required content", async ({
    page,
  }) => {
    await page.goto("/en/courses");

    // Courses page shows in-page "sign in required" content (no redirect)
    await expect(
      page.getByText(/sign in required|sign in/i).first(),
    ).toBeVisible();
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

  const adminManagementRoutes = [
    "department",
    "lecturer",
    "course",
    "semester",
    "course-semester",
    "enrollment-session",
    "enrollment",
    "requests",
  ];

  for (const route of adminManagementRoutes) {
    test(`unauthenticated access to /admin/management/${route} redirects to admin sign-in`, async ({
      page,
    }) => {
      await page.goto(`/en/admin/management/${route}`);

      await expect(page).toHaveURL(/\/admin\/sign-in/);
    });
  }
});
