import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      exclude: ["src/server.ts", "vitest.config.ts"],
      reportsDirectory: "./coverage",
      reporter: ["text", "json-summary", "html"],
      thresholds: {
        statements: 85,
        branches: 100,
        functions: 100,
        lines: 85
      }
    }
  }
});
