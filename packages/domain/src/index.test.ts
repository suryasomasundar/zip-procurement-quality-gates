import { describe, expect, it } from "vitest";

import {
  evaluateRequest,
  getApprovalRoute,
  getRiskLevel,
  sampleRequest,
  validateRequest
} from "./index";

describe("validateRequest", () => {
  it("returns field errors for empty required inputs", () => {
    const result = validateRequest({
      ...sampleRequest,
      title: " ",
      vendorName: "",
      justification: "",
      amount: 0
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.title).toBeDefined();
    expect(result.errors.vendorName).toBeDefined();
    expect(result.errors.justification).toBeDefined();
    expect(result.errors.amount).toBeDefined();
  });
});

describe("getApprovalRoute", () => {
  it("routes a larger data-sensitive request to manager, finance, legal, and security", () => {
    expect(getApprovalRoute(sampleRequest)).toEqual([
      "Manager",
      "Finance",
      "Legal",
      "Security"
    ]);
  });

  it("keeps a small low-risk request with manager only", () => {
    expect(
      getApprovalRoute({
        ...sampleRequest,
        amount: 400,
        contractRequired: false,
        handlesCustomerData: false
      })
    ).toEqual(["Manager"]);
  });
});

describe("getRiskLevel", () => {
  it("returns high risk for a request that is contract-backed and handles customer data", () => {
    expect(getRiskLevel(sampleRequest)).toBe("high");
  });

  it("returns medium risk for a finance-only trigger", () => {
    expect(
      getRiskLevel({
        ...sampleRequest,
        amount: 12000,
        contractRequired: false,
        handlesCustomerData: false
      })
    ).toBe("medium");
  });
});

describe("evaluateRequest", () => {
  it("returns a summary for a valid request", () => {
    const result = evaluateRequest(sampleRequest);

    expect(result.isValid).toBe(true);
    expect(result.summary).toContain("Atlas Supply Co.");
    expect(result.approvals).toContain("Finance");
  });
});
