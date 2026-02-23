# E2E Tests (Playwright)

## Prerequisites

- Node.js 18+
- Chromium (installed via `npx playwright install chromium`)

## Running Tests

**Start the dev server first** (in a separate terminal):

```bash
npm run dev
```

Then run the E2E tests:

```bash
# Run all tests (uses existing dev server on port 3000)
npm run test:e2e

# Run with UI mode
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug mode
npm run test:e2e:debug
```

### Using Bun

```bash
bun run test:e2e
bun run test:e2e:ui
bun run test:e2e:headed
bun run test:e2e:debug
```

## Test Structure

- **auth.spec.ts** – Sign-in flows (student, lecturer, admin) with mocked API
- **protected-route.spec.ts** – Unauthenticated access redirects to auth
- **student-crud.spec.ts** – Admin student CRUD (create, update, delete) with mocked API

## Configuration

- **playwright.config.ts** – Chromium by default, trace on failure, base URL `http://localhost:3000`
- **e2e/fixtures/auth.ts** – Auth API mocks and helpers

## Notes

- Auth and CRUD tests mock the backend API via `page.route()` for deterministic, fast runs
- Protected route tests require the Next.js proxy (proxy.ts) for redirect behavior
- Ensure no other process is using port 3000 when running tests
