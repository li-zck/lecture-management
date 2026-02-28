import { mockAdminSignIn, mockStudentSignIn } from "./fixtures/auth";
import { expect, test } from "./fixtures/axe";

/**
 * WCAG 2.1 AA accessibility tests using axe-core.
 * Run with: npm run test:e2e -- e2e/accessibility.spec.ts
 *
 * These tests catch automatically detectable issues such as:
 * - Missing form labels
 * - Duplicate IDs
 * - Color contrast violations
 * - Invalid ARIA attributes
 * - Keyboard navigation problems
 *
 * Manual testing with assistive technologies (screen readers, keyboard-only)
 * is still recommended for full WCAG conformance.
 */
test.describe("Accessibility (WCAG 2.1 AA)", () => {
  test("homepage should not have WCAG violations", async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto("/en");
    const results = await makeAxeBuilder().analyze();
    expect(results.violations).toEqual([]);
  });

  test("sign-in page should not have WCAG violations", async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto("/en/sign-in");
    const results = await makeAxeBuilder().analyze();
    const serious = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact || ""),
    );
    expect(serious).toEqual([]);
  });

  test("courses page should not have WCAG violations", async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto("/en/courses");
    const results = await makeAxeBuilder().analyze();
    const serious = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact || ""),
    );
    expect(serious).toEqual([]);
  });

  test("admin sign-in page should not have WCAG violations", async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto("/en/admin/sign-in");
    const results = await makeAxeBuilder().analyze();
    const serious = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact || ""),
    );
    expect(serious).toEqual([]);
  });

  test("admin dashboard (authenticated) should not have WCAG violations", async ({
    page,
    makeAxeBuilder,
  }) => {
    await mockAdminSignIn(page);
    await page.goto("/en/admin/sign-in");
    await page.getByLabel("Username").fill("admin");
    await page.getByLabel("Password", { exact: true }).fill("admin123");
    await page
      .getByRole("button", { name: /sign in as admin|sign in/i })
      .click();
    await expect(page).toHaveURL(/\/admin\/?$/);

    const results = await makeAxeBuilder().analyze();
    const serious = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact || ""),
    );
    expect(serious).toEqual([]);
  });

  test("privacy page should not have WCAG violations", async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto("/en/privacy");
    const results = await makeAxeBuilder().analyze();
    const serious = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact || ""),
    );
    expect(serious).toEqual([]);
  });

  test("support page should not have WCAG violations", async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto("/en/support");
    const results = await makeAxeBuilder().analyze();
    const serious = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact || ""),
    );
    expect(serious).toEqual([]);
  });

  test("settings page (authenticated) should not have WCAG violations", async ({
    page,
    makeAxeBuilder,
  }) => {
    await mockStudentSignIn(page);
    await page.goto("/en/sign-in");
    await page.getByLabel(/student id/i).fill("STU-001");
    await page.getByLabel(/password/i).fill("student123");
    await page
      .getByRole("button", { name: /sign in/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/my-courses/);
    await page.goto("/en/settings");

    const results = await makeAxeBuilder().analyze();
    const serious = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact || ""),
    );
    expect(serious).toEqual([]);
  });
});
