import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import express from "express";
import rateLimit from "express-rate-limit";

import { evaluateRequest, type ProcurementRequest } from "@zip-takehome/domain";

type AppOptions = {
  webDistDirectory?: string;
};

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const defaultWebDistDirectory = path.resolve(currentDirectory, "../../web/dist");

export function createApp(options: AppOptions = {}) {
  const app = express();
  const webDistDirectory = options.webDistDirectory ?? defaultWebDistDirectory;
  const hasBuiltFrontend = fs.existsSync(webDistDirectory);
  const frontendFallbackLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  });

  app.use(express.json());

  app.get("/api/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  app.post("/api/requests/evaluate", (request, response) => {
    const result = evaluateRequest(request.body as ProcurementRequest);

    if (!result.isValid) {
      response.status(422).json(result);
      return;
    }

    response.json(result);
  });

  if (hasBuiltFrontend) {
    app.use(express.static(webDistDirectory));

    app.get("*", frontendFallbackLimiter, (request, response, next) => {
      if (request.path.startsWith("/api/")) {
        next();
        return;
      }

      response.sendFile(path.join(webDistDirectory, "index.html"));
    });
  }

  return app;
}

export const app = createApp();
