import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { sampleRequest } from "@zip-takehome/domain";

import {
  app,
  createApp,
  getReleaseMetadata,
  resolveDefaultWebDistDirectory
} from "./app";

describe("POST /api/requests/evaluate", () => {
  it("returns service health", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.version).toBeDefined();
    expect(response.body.commitSha).toBeDefined();
  });

  it("returns an approval route for a valid request", async () => {
    const response = await request(app)
      .post("/api/requests/evaluate")
      .send(sampleRequest);

    expect(response.status).toBe(200);
    expect(response.body.approvals).toEqual([
      "Manager",
      "Finance",
      "Legal",
      "Security"
    ]);
    expect(response.body.riskLevel).toBe("high");
  });

  it("returns validation errors for an invalid request", async () => {
    const response = await request(app).post("/api/requests/evaluate").send({
      ...sampleRequest,
      title: "",
      amount: -10
    });

    expect(response.status).toBe(422);
    expect(response.body.errors.title).toBeDefined();
    expect(response.body.errors.amount).toBeDefined();
  });
});

describe("frontend fallback hosting", () => {
  const webDistDirectory = path.join(os.tmpdir(), `zip-render-${Date.now()}`);
  const indexFilePath = path.join(webDistDirectory, "index.html");

  beforeAll(async () => {
    await fs.mkdir(webDistDirectory, { recursive: true });
    await fs.writeFile(indexFilePath, "<html><body>render smoke</body></html>");
  });

  afterAll(async () => {
    await fs.rm(webDistDirectory, { recursive: true, force: true });
  });

  it("serves the frontend index for non-API routes", async () => {
    const response = await request(createApp({ webDistDirectory })).get("/requests/123");

    expect(response.status).toBe(200);
    expect(response.text).toContain("render smoke");
  });

  it("does not swallow unknown API routes", async () => {
    const response = await request(createApp({ webDistDirectory })).get("/api/missing");

    expect(response.status).toBe(404);
  });

  it("does not register a frontend fallback when no built frontend exists", async () => {
    const missingWebDistDirectory = path.join(webDistDirectory, "missing");
    const response = await request(createApp({ webDistDirectory: missingWebDistDirectory })).get(
      "/"
    );

    expect(response.status).toBe(404);
  });
});

describe("resolveDefaultWebDistDirectory", () => {
  it("uses the default candidate directories when none are provided", () => {
    const selectedDirectory = resolveDefaultWebDistDirectory({
      existsSync: () => true
    });

    expect(selectedDirectory).toContain("apps/web/dist");
  });

  it("returns the first existing candidate directory", () => {
    const selectedDirectory = resolveDefaultWebDistDirectory({
      candidateDirectories: ["/missing", "/available"],
      existsSync: (directoryPath) => directoryPath === "/available"
    });

    expect(selectedDirectory).toBe("/available");
  });

  it("falls back to the first candidate when none exist", () => {
    const selectedDirectory = resolveDefaultWebDistDirectory({
      candidateDirectories: ["/missing-one", "/missing-two"],
      existsSync: () => false
    });

    expect(selectedDirectory).toBe("/missing-one");
  });
});

describe("getReleaseMetadata", () => {
  const originalReleaseVersion = process.env.RELEASE_VERSION;
  const originalPackageVersion = process.env.npm_package_version;
  const originalRenderCommit = process.env.RENDER_GIT_COMMIT;
  const originalGitHubSha = process.env.GITHUB_SHA;

  afterAll(() => {
    process.env.RELEASE_VERSION = originalReleaseVersion;
    process.env.npm_package_version = originalPackageVersion;
    process.env.RENDER_GIT_COMMIT = originalRenderCommit;
    process.env.GITHUB_SHA = originalGitHubSha;
  });

  it("prefers explicit release metadata from the environment", () => {
    process.env.RELEASE_VERSION = "v1.2.3";
    process.env.npm_package_version = "0.0.0";
    process.env.RENDER_GIT_COMMIT = "render-sha";
    process.env.GITHUB_SHA = "github-sha";

    expect(getReleaseMetadata()).toEqual({
      version: "v1.2.3",
      commitSha: "render-sha"
    });
  });

  it("falls back to package and local defaults when release metadata is missing", () => {
    delete process.env.RELEASE_VERSION;
    delete process.env.RENDER_GIT_COMMIT;
    delete process.env.GITHUB_SHA;
    process.env.npm_package_version = "1.0.0";

    expect(getReleaseMetadata()).toEqual({
      version: "1.0.0",
      commitSha: "local"
    });
  });

  it("falls back to dev when no version metadata exists", () => {
    delete process.env.RELEASE_VERSION;
    delete process.env.npm_package_version;

    expect(getReleaseMetadata().version).toBe("dev");
  });
});
