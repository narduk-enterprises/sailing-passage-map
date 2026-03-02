import { defineConfig, devices } from '@playwright/test'

/**
 * Root Playwright config so the Test Explorer shows all example app E2E tests.
 * Each project points to one app's tests and baseURL. Run from repo root.
 * Starts all apps via `pnpm dev:showcase` (or reuse existing servers).
 */
export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  maxFailures: process.env.CI ? undefined : 1,
  reporter: 'html',
  // Tight timeouts for fail-fast; increase when tuning (e.g. timeout: 30_000, actionTimeout: 10_000).
  timeout: 5_000,
  expect: { timeout: 2_000 },
  use: {
    trace: 'on-first-retry',
    actionTimeout: 3_000,
    navigationTimeout: 5_000,
  },
  webServer: {
    command: 'pnpm run dev:showcase',
    url: 'http://localhost:3010',
    reuseExistingServer: true,
    timeout: 30_000,
  },
  projects: [
    {
      name: 'showcase',
      testDir: 'apps/showcase/tests/e2e',
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:3010' },
    },
    {
      name: 'example-auth',
      testDir: 'apps/example-auth/tests/e2e',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3011',
        timeout: 15_000,
      },
    },
    {
      name: 'example-blog',
      testDir: 'apps/example-blog/tests/e2e',
      timeout: 30_000,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3012',
        navigationTimeout: 15_000,
        actionTimeout: 10_000,
      },
    },
    {
      name: 'example-marketing',
      testDir: 'apps/example-marketing/tests/e2e',
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:3013' },
      timeout: 30_000,
    },
    {
      name: 'example-dashboard',
      testDir: 'apps/example-dashboard/tests/e2e',
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:3014' },
    },
    {
      name: 'example-apple-maps',
      testDir: 'apps/example-apple-maps/tests/e2e',
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:3016' },
      timeout: 15_000,
    },
  ],
})
