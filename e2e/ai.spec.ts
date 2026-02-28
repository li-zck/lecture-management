import { expect } from "@playwright/test";
import { mockStudentSignIn, test } from "./fixtures/auth";

const AI_CONSENT_ACCEPTED = {
  accepted: true,
  acceptedAt: "2025-01-01T00:00:00Z",
  version: "v1",
};

const AI_CONSENT_NOT_ACCEPTED = {
  accepted: false,
  acceptedAt: null,
  version: null,
};

function mockAiConsent(
  page: import("@playwright/test").Page,
  initialAccepted: boolean,
) {
  let accepted = initialAccepted;
  return page.route("**/ai/consent", (route) => {
    if (route.request().method() === "POST") {
      accepted = true;
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(AI_CONSENT_ACCEPTED),
      });
    }
    if (route.request().method() === "GET") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(
          accepted ? AI_CONSENT_ACCEPTED : AI_CONSENT_NOT_ACCEPTED,
        ),
      });
    }
    return route.continue();
  });
}

function mockAiConversationsList(
  page: import("@playwright/test").Page,
  list: { id: string; title: string; preset: string | null }[] = [],
) {
  return page.route("**/ai/conversations", (route) => {
    if (route.request().method() !== "GET") return route.continue();
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(
        list.map((c) => ({
          ...c,
          createdAt: "2025-01-01T00:00:00Z",
          updatedAt: "2025-01-01T00:00:00Z",
          _count: { messages: 0 },
        })),
      ),
    });
  });
}

function mockAiCreateConversation(
  page: import("@playwright/test").Page,
  conversation: {
    id: string;
    title: string;
    preset: string | null;
    messages?: { id: string; role: string; content: string }[];
  },
) {
  return page.route("**/ai/conversations", (route) => {
    if (route.request().method() !== "POST") return route.continue();
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: conversation.id,
        title: conversation.title,
        preset: conversation.preset,
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z",
        messages: conversation.messages ?? [],
      }),
    });
  });
}

function mockAiGetConversation(
  page: import("@playwright/test").Page,
  id: string,
  conversation: {
    id: string;
    title: string;
    preset: string | null;
    messages?: { id: string; role: string; content: string }[];
  },
) {
  return page.route(`**/ai/conversations/${id}`, (route) => {
    if (route.request().method() !== "GET") return route.continue();
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: conversation.id,
        title: conversation.title,
        preset: conversation.preset,
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z",
        messages: (conversation.messages ?? []).map((m) => ({
          ...m,
          conversationId: id,
          createdAt: "2025-01-01T00:00:00Z",
        })),
      }),
    });
  });
}

test.describe("AI Usage Flows", () => {
  test.describe("AI Policy (public)", () => {
    test("ai-policy page loads and shows policy sections", async ({ page }) => {
      await page.goto("/en/ai-policy");

      await expect(page).toHaveURL(/\/ai-policy/);
      await expect(
        page.getByRole("heading", {
          level: 1,
          name: /AI privacy.*usage policy/i,
        }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: /for students/i }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: /for lecturers/i }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: /what the AI does not see/i }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: /your control/i }),
      ).toBeVisible();
    });
  });

  test.describe("AI Chat (unauthenticated)", () => {
    test("ai-chat redirects to sign-in when not logged in", async ({
      page,
    }) => {
      await page.goto("/en/ai-chat");

      await expect(page).toHaveURL(/\/sign-in/);
      await expect(
        page.getByRole("heading", { name: /welcome back/i }),
      ).toBeVisible();
    });
  });

  test.describe("AI Chat (consent flow)", () => {
    test("shows consent screen when consent not yet accepted", async ({
      page,
    }) => {
      mockStudentSignIn(page);
      mockAiConsent(page, false);
      mockAiConversationsList(page);

      await page.goto("/en/sign-in");
      await page.getByLabel(/student id/i).fill("STU-001");
      await page.getByLabel(/password/i).fill("student123");
      await page
        .getByRole("button", { name: /sign in/i })
        .first()
        .click();
      await expect(page).toHaveURL(/\/my-courses/);

      await page.goto("/en/ai-chat");

      await expect(page).toHaveURL(/\/ai-chat/);
      await expect(
        page.getByText(/before you start using AI/i).first(),
      ).toBeVisible();
      await expect(
        page.getByRole("checkbox", { name: /understand and agree/i }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: /agree and continue/i }),
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: /AI privacy.*usage policy/i }),
      ).toBeVisible();
    });

    test("accepting consent shows main AI chat UI", async ({ page }) => {
      mockStudentSignIn(page);
      mockAiConsent(page, false);
      mockAiConversationsList(page);

      await page.goto("/en/sign-in");
      await page.getByLabel(/student id/i).fill("STU-001");
      await page.getByLabel(/password/i).fill("student123");
      await page
        .getByRole("button", { name: /sign in/i })
        .first()
        .click();
      await expect(page).toHaveURL(/\/my-courses/);

      await page.goto("/en/ai-chat");
      await expect(
        page.getByRole("button", { name: /agree and continue/i }),
      ).toBeVisible();

      await page
        .getByRole("checkbox", { name: /understand and agree/i })
        .check();
      await page.getByRole("button", { name: /agree and continue/i }).click();

      await expect(
        page.getByText(/welcome to AI assistant/i).first(),
      ).toBeVisible({ timeout: 10000 });
      await expect(page.getByText(/quick start/i).first()).toBeVisible();
    });
  });

  test.describe("AI Chat (main view)", () => {
    test("shows welcome and presets when consent already accepted", async ({
      page,
    }) => {
      mockStudentSignIn(page);
      mockAiConsent(page, true);
      mockAiConversationsList(page);

      await page.goto("/en/sign-in");
      await page.getByLabel(/student id/i).fill("STU-001");
      await page.getByLabel(/password/i).fill("student123");
      await page
        .getByRole("button", { name: /sign in/i })
        .first()
        .click();
      await expect(page).toHaveURL(/\/my-courses/);

      await page.goto("/en/ai-chat");

      await expect(page).toHaveURL(/\/ai-chat/);
      await expect(
        page.getByText(/welcome to AI assistant/i).first(),
      ).toBeVisible({ timeout: 10000 });
      await expect(
        page.getByRole("button", { name: /schedule insights/i }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: /academic advisor/i }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: /general LMS help/i }),
      ).toBeVisible();
    });
  });

  test.describe("AI Chat (create conversation)", () => {
    test("clicking preset creates conversation and navigates to chat", async ({
      page,
    }) => {
      const convId = "e2e-conv-1";
      mockStudentSignIn(page);
      mockAiConsent(page, true);
      mockAiConversationsList(page);
      mockAiCreateConversation(page, {
        id: convId,
        title: "General LMS Help",
        preset: "general",
      });
      mockAiGetConversation(page, convId, {
        id: convId,
        title: "General LMS Help",
        preset: "general",
        messages: [],
      });

      await page.goto("/en/sign-in");
      await page.getByLabel(/student id/i).fill("STU-001");
      await page.getByLabel(/password/i).fill("student123");
      await page
        .getByRole("button", { name: /sign in/i })
        .first()
        .click();
      await expect(page).toHaveURL(/\/my-courses/);

      await page.goto("/en/ai-chat");
      await expect(
        page.getByText(/welcome to AI assistant/i).first(),
      ).toBeVisible({ timeout: 10000 });

      await page.getByRole("button", { name: /general LMS help/i }).click();

      await expect(page).toHaveURL(new RegExp(`/ai-chat/${convId}`));
      await expect(
        page.getByRole("heading", { name: /general LMS help/i }),
      ).toBeVisible();
    });
  });
});
