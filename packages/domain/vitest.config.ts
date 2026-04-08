import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      reportsDirectory: "./coverage",
      reporter: ["text", "json-summary", "html"],
      thresholds: {
        statements: 90,
        branches: 75,
        functions: 100,
        lines: 90
      }
    }
  }
});
