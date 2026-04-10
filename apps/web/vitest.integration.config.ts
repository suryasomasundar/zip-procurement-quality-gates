import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: "./src/test/setup.ts",
    include: ["src/**/*.integration.test.tsx"],
    exclude: ["tests/e2e/**"],
    coverage: {
      exclude: [
        "dist/**",
        "playwright.config.ts",
        "vitest.integration.config.ts",
        "vite.config.ts",
        "src/main.tsx",
        "src/test/**",
        "tests/**"
      ],
      reportsDirectory: "./coverage",
      reporter: ["text", "json-summary", "html"],
      thresholds: {
        statements: 95,
        branches: 80,
        functions: 80,
        lines: 95
      }
    }
  }
});
