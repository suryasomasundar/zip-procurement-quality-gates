import { defineConfig } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4173";
const useLocalWebServer = process.env.PLAYWRIGHT_SKIP_WEBSERVER !== "1";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30000,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "retain-on-failure"
  },
  webServer: useLocalWebServer
    ? {
        command: "npm run dev:e2e",
        cwd: "../..",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120000
      }
    : undefined
});
