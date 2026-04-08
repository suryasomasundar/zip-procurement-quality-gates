import type {
  EvaluationResult,
  ProcurementRequest,
  ValidationResult
} from "@zip-takehome/domain";

export async function evaluateProcurementRequest(
  request: ProcurementRequest
): Promise<ValidationResult & Partial<EvaluationResult>> {
  const response = await fetch("/api/requests/evaluate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(request)
  });

  return (await response.json()) as ValidationResult & Partial<EvaluationResult>;
}
