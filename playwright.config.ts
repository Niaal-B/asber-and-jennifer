import { defineConfig, devices } from '@playwright/test';

const PORT = 5174;

export default defineConfig({
  testDir: 'tests',
  testMatch: /.*\.spec\.ts/,
  timeout: 30_000,
  fullyParallel: true,
  // The dev server compiles on demand; too many parallel browsers makes timings flaky.
  workers: 4,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    // Uses the locally installed Google Chrome; no browser download needed.
    channel: 'chrome',
  },
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'], channel: 'chrome' } },
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    // No RSVP_SCRIPT_URL here, so the dev server uses its mock Apps Script.
    command: `npx vite --port ${PORT} --strictPort`,
    port: PORT,
    reuseExistingServer: true,
    env: { RSVP_SCRIPT_URL: '' },
  },
});
