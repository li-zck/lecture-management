import { test as base, expect } from "@playwright/test";

/**
 * Mock successful admin sign-in response
 */
export const mockAdminSignIn = (page: import("@playwright/test").Page) => {
  return page.route("**/api/auth/admin/signin", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        accessToken:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbi0xIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.test",
        message: "Signed in successfully",
      }),
    });
  });
};

/**
 * Mock successful student sign-in response
 */
export const mockStudentSignIn = (page: import("@playwright/test").Page) => {
  return page.route("**/api/auth/student/signin", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: {
          accessToken:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHVkZW50LTEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTUxNjIzOTAyMn0.test",
        },
      }),
    });
  });
};

/**
 * Mock successful lecturer sign-in response
 */
export const mockLecturerSignIn = (page: import("@playwright/test").Page) => {
  return page.route("**/api/auth/lecturer/signin", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: {
          accessToken:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsZWN0dXJlci0xIiwicm9sZSI6ImxlY3R1cmVyIiwiaWF0IjoxNTE2MjM5MDIyfQ.test",
        },
      }),
    });
  });
};

/**
 * Assert that accessToken cookie is set
 */
export async function expectAuthCookie(page: import("@playwright/test").Page) {
  const cookies = await page.context().cookies();
  const accessToken = cookies.find((c) => c.name === "accessToken");
  expect(accessToken).toBeDefined();
  expect(accessToken?.value).toBeTruthy();
}

export const test = base.extend<{ authenticatedAdmin: void }>({
  authenticatedAdmin: async ({ page }, use) => {
    await mockAdminSignIn(page);
    await page.goto("/en/admin/sign-in");
    await page.getByLabel("Username").fill("admin");
    await page.getByLabel("Password", { exact: true }).fill("admin123");
    await page
      .getByRole("button", { name: /sign in as admin|sign in/i })
      .click();
    await expect(page).toHaveURL(/\/admin\/?$/);
    await use();
  },
});

export { expect };
