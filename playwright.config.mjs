import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.PLAYWRIGHT_PORT || 4173);
const host = process.env.PLAYWRIGHT_HOST || '127.0.0.1';
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://${host}:${port}`;

export default defineConfig({
  testDir: './test/e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  timeout: 90_000,
  expect: {
    timeout: 45_000,
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 30_000,
    navigationTimeout: 60_000,
  },
  webServer: {
    command: 'node scripts/e2e-server.mjs',
    url: baseURL,
    reuseExistingServer: process.env.PLAYWRIGHT_REUSE_SERVER === '1',
    timeout: 20 * 60 * 1000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
