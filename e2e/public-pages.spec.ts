import { expect, test } from "@playwright/test";

test.describe("Public Pages", () => {
  test("homepage loads and shows key sections", async ({ page }) => {
    await page.goto("/en");

    await expect(page).toHaveURL(/\/en\/?$/);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await expect(
      page.getByRole("link", { name: /sign in/i }).first(),
    ).toBeVisible();
  });

  test("about page loads", async ({ page }) => {
    await page.goto("/en/about");

    await expect(page).toHaveURL(/\/about/);
    await expect(
      page.getByRole("heading", { name: /about/i }).first(),
    ).toBeVisible();
  });

  test("site policy page loads", async ({ page }) => {
    await page.goto("/en/site-policy");

    await expect(page).toHaveURL(/\/site-policy/);
    await expect(
      page.getByRole("heading", { name: /site policy|terms/i }).first(),
    ).toBeVisible();
  });

  test("privacy page loads", async ({ page }) => {
    await page.goto("/en/privacy");

    await expect(page).toHaveURL(/\/privacy/);
    await expect(
      page.getByRole("heading", { name: /privacy/i }).first(),
    ).toBeVisible();
  });

  test("support page loads and form is visible", async ({ page }) => {
    await page.goto("/en/support");

    await expect(page).toHaveURL(/\/support/);
    await expect(
      page.getByRole("heading", { name: /how can we help|support/i }).first(),
    ).toBeVisible();
    await expect(
      page.getByLabel(/full name/i).or(page.getByLabel(/name/i)),
    ).toBeVisible();
  });

  test("support form submit redirects to success page", async ({ page }) => {
    await page.goto("/en/support");

    await page.getByLabel(/full name/i).fill("Test User");
    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByLabel(/your role/i).click();
    await page.getByRole("option", { name: /student/i }).click();
    await page.getByLabel(/issue category/i).click();
    await page.getByRole("option").first().click();
    await page.getByLabel(/subject/i).fill("Test subject");
    await page.getByLabel(/message/i).fill("Test message");

    await page.getByRole("button", { name: /submit request/i }).click();

    await expect(page).toHaveURL(/\/support\/success/);
  });

  test("courses page redirects to sign-in when unauthenticated", async ({
    page,
  }) => {
    await page.goto("/en/courses");

    await expect(page).toHaveURL(/\/sign-in/);
    await expect(
      page.getByRole("heading", { name: /welcome back/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /sign in/i }).first(),
    ).toBeVisible();
  });

  test("locale switch updates URL", async ({ page }) => {
    await page.goto("/en");

    await page.getByRole("button", { name: /change language/i }).click();
    await page
      .getByRole("menuitem", { name: /tiếng việt|vietnamese/i })
      .click();

    await expect(page).toHaveURL(/\/vi\/?$/);
  });
});
