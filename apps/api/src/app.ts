import express from "express";

import { evaluateRequest, type ProcurementRequest } from "@zip-takehome/domain";

export const app = express();

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
