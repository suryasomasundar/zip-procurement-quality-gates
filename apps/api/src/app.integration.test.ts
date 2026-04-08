import request from "supertest";
import { describe, expect, it } from "vitest";

import { sampleRequest } from "@zip-takehome/domain";

import { app } from "./app";

describe("POST /api/requests/evaluate", () => {
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
