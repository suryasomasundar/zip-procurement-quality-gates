import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import express from "express";

import { evaluateRequest, type ProcurementRequest } from "@zip-takehome/domain";

export const app = express();

app.use(express.json());

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const webDistDirectory = path.resolve(currentDirectory, "../../web/dist");
const hasBuiltFrontend = fs.existsSync(webDistDirectory);

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

  app.get("*", (request, response, next) => {
    if (request.path.startsWith("/api/")) {
      next();
      return;
    }

    response.sendFile(path.join(webDistDirectory, "index.html"));
  });
}
