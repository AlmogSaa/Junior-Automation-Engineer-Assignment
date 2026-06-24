// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // Directory that contains all spec files
  testDir: './tests',

  // Re-run failed tests once before marking them as failed
  retries: 1,

  // Fail the suite fast if a test exceeds this duration (30 s)
  timeout: 30_000,

  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],

  use: {
    // Base URL so tests can use relative paths if needed
    baseURL: 'https://test.netlify.app/',

    // Collect a screenshot on failure automatically (separate from manual ones)
    screenshot: 'only-on-failure',

    // Record a video on the first retry to aid debugging
    video: 'on-first-retry',

    // Slow down actions by 50 ms
    // actionTimeout: 0,
  },

  // Run tests across desktop Chrome, Firefox, and WebKit (Safari engine)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
