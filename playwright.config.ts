import { defineConfig, devices } from "@playwright/test";
import { ENV } from "./config/env";
import { CONSTANTS } from "./config/constants";

export default defineConfig({
  // Test Directory
  testDir: "./tests",

  // Run tests in parallel
  fullyParallel: true,

  // Fail if test.only is committed
  forbidOnly: !!process.env.CI,

  // Retry failed tests
  retries: process.env.CI ? ENV.getRetryCount() : 0,

  // Workers in CI
  workers: process.env.CI ? 1 : undefined,

  // Timeout for each test
  timeout: ENV.getDefaultTimeout(),

  // Expect timeout
  expect: {
    timeout: CONSTANTS.SHORT_TIMEOUT,
  },

  // Reporters
  reporter: [
    ["html"],
    ["list"],
    ["json", { outputFile: "reports/report.json" }],
  ],

  // Global Settings
  use: {
    // Base URL
    baseURL: ENV.getBaseUrl(),

    // Browser Mode
    headless: ENV.isHeadless(),

    // Browser Size
    viewport: {
      width: 1920,
      height: 1080,
    },

    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,

    // Screenshot
    screenshot: "only-on-failure",

    // Video
    video: "retain-on-failure",

    // Trace
    trace: "retain-on-failure",

    // Action timeout
    actionTimeout: CONSTANTS.DEFAULT_TIMEOUT,

    // Navigation timeout
    navigationTimeout: CONSTANTS.DEFAULT_TIMEOUT,
  },

  // Browser Projects
  projects: [
    {
      name: "Chromium",

      use: {
        ...devices["Desktop Chrome"],
      },
    },

    {
      name: "Firefox",

      use: {
        ...devices["Desktop Firefox"],
      },
    },

    {
      name: "Webkit",

      use: {
        ...devices["Desktop Safari"],
      },
    },
  ],

  // Output Directory
  outputDir: "test-results",
});
