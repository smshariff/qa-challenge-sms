import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
//dotenv.config({ path: path.resolve(__dirname, ".env") });

// Determine the environment; default to 'demo'
const env = process.env.ENV || "demo";

// Load the corresponding .env file
dotenv.config({ path: path.resolve(__dirname, `.env.${env}`) });

//Running Tests in Different Environments:
// ENV=demo npx playwright test

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // Folder where tests are located
  testDir: "./tests",

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",

    baseURL: process.env.UI_BASE_URL,
    // Don't stop loading the website due to self-signed security certificates
    ignoreHTTPSErrors: process.env.IGNORE_HTTP_ERRORS ? true : false,

    actionTimeout: 120000,
    navigationTimeout: 120000,
  },

  /* Global setup and teardown configuration */
  // This runs once before all tests
  globalSetup: "./tests/global.setup.ts",
  // This runs once after all tests
  globalTeardown: "./tests/global.teardown.ts",
  // Usually 30 seconds is sufficient.
  timeout: 30000,
  globalTimeout: 30000,

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /.*\.spec\.ts/,
    },
  ],
});
