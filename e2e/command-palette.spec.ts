import { expect, test } from "./fixtures/auth";

test.describe("Admin Command Palette", () => {
  test("opens with Cmd+K and navigates to Students", async ({
    page,
    // authenticatedAdmin,
  }) => {
    await page.keyboard.press("Meta+k");
    await expect(
      page.getByPlaceholder(/type a command or search/i),
    ).toBeVisible({ timeout: 3000 });

    await page.getByPlaceholder(/type a command or search/i).fill("student");
    await page.getByText("Students", { exact: true }).click();

    await expect(page).toHaveURL(/\/admin\/management\/student/);
  });

  test("opens via Search button click", async ({
    page,
    // authenticatedAdmin,
  }) => {
    await page.getByRole("button", { name: /search/i }).click();
    await expect(
      page.getByPlaceholder(/type a command or search/i),
    ).toBeVisible({ timeout: 3000 });
  });
});
