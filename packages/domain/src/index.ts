export type RequestCategory = "software" | "hardware" | "services" | "other";
export type PaymentMethod = "invoice" | "card" | "wire";
export type ApprovalTeam = "Manager" | "Finance" | "Legal" | "Security";
export type RiskLevel = "low" | "medium" | "high";

export interface ProcurementRequest {
  title: string;
  vendorName: string;
  category: RequestCategory;
  amount: number;
  paymentMethod: PaymentMethod;
  contractRequired: boolean;
  handlesCustomerData: boolean;
  justification: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof ProcurementRequest, string>>;
}

export interface EvaluationResult {
  approvals: ApprovalTeam[];
  riskLevel: RiskLevel;
  summary: string;
}

const requiredMessage = "This field is required.";

export function validateRequest(
  request: ProcurementRequest
): ValidationResult {
  const errors: ValidationResult["errors"] = {};

  if (!request.title.trim()) {
    errors.title = requiredMessage;
  }

  if (!request.vendorName.trim()) {
    errors.vendorName = requiredMessage;
  }

  if (!request.justification.trim()) {
    errors.justification = requiredMessage;
  }

  if (!Number.isFinite(request.amount) || request.amount <= 0) {
    errors.amount = "Amount must be greater than zero.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function getApprovalRoute(
  request: ProcurementRequest
): ApprovalTeam[] {
  const approvals = new Set<ApprovalTeam>(["Manager"]);

  if (request.amount >= 10000) {
    approvals.add("Finance");
  }

  if (request.contractRequired) {
    approvals.add("Legal");
  }

  if (request.handlesCustomerData) {
    approvals.add("Security");
  }

  return Array.from(approvals);
}

export function getRiskLevel(request: ProcurementRequest): RiskLevel {
  if (
    request.amount >= 50000 ||
    (request.contractRequired && request.handlesCustomerData)
  ) {
    return "high";
  }

  if (
    request.amount >= 10000 ||
    request.contractRequired ||
    request.handlesCustomerData
  ) {
    return "medium";
  }

  return "low";
}

export function evaluateRequest(
  request: ProcurementRequest
): ValidationResult & Partial<EvaluationResult> {
  const validation = validateRequest(request);

  if (!validation.isValid) {
    return validation;
  }

  const approvals = getApprovalRoute(request);
  const riskLevel = getRiskLevel(request);
  const summary = `${request.vendorName} requires ${approvals.join(
    ", "
  )} approval with ${riskLevel} risk.`;

  return {
    ...validation,
    approvals,
    riskLevel,
    summary
  };
}

export const sampleRequest: ProcurementRequest = {
  title: "New analytics platform",
  vendorName: "Atlas Supply Co.",
  category: "software",
  amount: 18000,
  paymentMethod: "invoice",
  contractRequired: true,
  handlesCustomerData: true,
  justification: "Centralize sourcing and spend analytics for procurement."
};
