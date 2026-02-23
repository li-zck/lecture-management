import { expect, test } from "@playwright/test";
import { expectAuthCookie, mockAdminSignIn } from "./fixtures/auth";

const MOCK_PROFILE_REQUESTS = [
  {
    id: "profile-req-1",
    userId: "user-1",
    role: "student",
    requestedData: { fullName: "Updated Name", phone: "+84999999999" },
    status: "PENDING" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: {
      id: "user-1",
      fullName: "Original Name",
      studentId: "STU001",
      email: "student@example.com",
    },
  },
];

const MOCK_LECTURER_REQUESTS = [
  {
    id: "lect-req-1",
    lecturerId: "lec-1",
    courseOnSemesterId: "cos-1",
    status: "PENDING" as const,
    createdAt: "",
    updatedAt: "",
    lecturer: {
      id: "lec-1",
      fullName: "Dr. Test",
      lecturerId: "GV001",
      email: "lecturer@example.com",
    },
    courseOnSemester: {
      id: "cos-1",
      course: { id: "c1", name: "Intro to CS", department: null },
      semester: {
        id: "s1",
        name: "Fall 2024",
        startDate: "2024-09-01",
        endDate: "2024-12-15",
      },
      dayOfWeek: 1,
      startTime: 480,
      endTime: 570,
      location: "Room 101",
    },
  },
];

function setupApiMocks(page: import("@playwright/test").Page) {
  mockAdminSignIn(page);

  page.route("**/api/admin/notification/admin-broadcast", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    }),
  );

  page.route("**/api/admin/request/lecturer/all*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_LECTURER_REQUESTS),
    }),
  );

  page.route("**/api/admin/profile-update-request/all*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_PROFILE_REQUESTS),
    }),
  );

  page.route("**/api/admin/profile-update-request/approve/*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ message: "Approved" }),
    }),
  );

  page.route("**/api/admin/profile-update-request/reject/*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ message: "Rejected" }),
    }),
  );

  page.route("**/api/admin/request/lecturer/approve/*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ message: "Approved" }),
    }),
  );

  page.route("**/api/admin/request/lecturer/reject/*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ message: "Rejected" }),
    }),
  );
}

test.describe("Admin Requests", () => {
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

  test("visits requests page and sees lecturer requests tab by default", async ({
    page,
  }) => {
    await page.goto("/en/admin/management/requests");

    await expect(page).toHaveURL(/\/admin\/management\/requests/);
    await expect(page.getByRole("heading", { name: "Requests" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Lecturer requests" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Profile updates" }),
    ).toBeVisible();
    await expect(page.getByText("Dr. Test")).toBeVisible();
    await expect(page.getByText("Intro to CS")).toBeVisible();
  });

  test("switches to Profile updates tab and sees pending requests", async ({
    page,
  }) => {
    await page.goto("/en/admin/management/requests");

    await page.getByRole("button", { name: /profile updates/i }).click();

    await expect(page.getByText("Original Name")).toBeVisible();
    await expect(
      page.getByRole("main").getByText("student", { exact: true }),
    ).toBeVisible();
    await expect(page.getByText("PENDING")).toBeVisible();
    await expect(page.getByRole("button", { name: "Approve" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Reject" })).toBeVisible();
  });

  test("approves profile update request - API called", async ({ page }) => {
    await page.goto("/en/admin/management/requests");
    await page.getByRole("button", { name: /profile updates/i }).click();

    const approveRequest = page.waitForRequest((req) =>
      req.url().includes("/admin/profile-update-request/approve/"),
    );

    await page.getByRole("button", { name: "Approve" }).click();

    await expect(approveRequest).resolves.toBeDefined();
  });

  test("rejects profile update request - API called", async ({ page }) => {
    await page.goto("/en/admin/management/requests");
    await page.getByRole("button", { name: /profile updates/i }).click();

    const rejectRequest = page.waitForRequest((req) =>
      req.url().includes("/admin/profile-update-request/reject/"),
    );

    await page.getByRole("button", { name: "Reject" }).click();

    await expect(rejectRequest).resolves.toBeDefined();
  });

  test("approves lecturer teaching request - API called", async ({ page }) => {
    await page.goto("/en/admin/management/requests");

    const approveRequest = page.waitForRequest((req) =>
      req.url().includes("/admin/request/lecturer/approve/"),
    );

    await page.getByRole("button", { name: "Approve" }).first().click();

    await expect(approveRequest).resolves.toBeDefined();
  });
});
