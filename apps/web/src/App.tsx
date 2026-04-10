import { useEffect, useState } from "react";

import type { ProcurementRequest } from "@zip-takehome/domain";

import { evaluateProcurementRequest, fetchDeploymentHealth } from "./api";

const initialForm: ProcurementRequest = {
  title: "",
  vendorName: "",
  category: "software",
  amount: 0,
  paymentMethod: "invoice",
  contractRequired: false,
  handlesCustomerData: false,
  justification: ""
};

type SubmissionState =
  | { status: "idle" }
  | { status: "loading" }
  | {
      status: "success";
      data: {
        summary: string;
        approvals: string[];
        riskLevel: string;
      };
    }
  | {
      status: "error";
      message: string;
    };

export default function App() {
  const [form, setForm] = useState<ProcurementRequest>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ProcurementRequest, string>>>({});
  const [submission, setSubmission] = useState<SubmissionState>({ status: "idle" });
  const [deploymentVersion, setDeploymentVersion] = useState<string>("loading");

  useEffect(() => {
    let cancelled = false;

    fetchDeploymentHealth()
      .then((health) => {
        if (!cancelled) {
          setDeploymentVersion(health.version);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDeploymentVersion("unknown");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmission({ status: "loading" });

    const result = await evaluateProcurementRequest(form);

    if (!result.isValid) {
      setErrors(result.errors);
      setSubmission({
        status: "error",
        message: "Please fix the highlighted fields before submitting."
      });
      return;
    }

    setErrors({});
    setSubmission({
      status: "success",
      data: {
        summary: result.summary ?? "",
        approvals: result.approvals ?? [],
        riskLevel: result.riskLevel ?? "low"
      }
    });
  }

  function updateField<Key extends keyof ProcurementRequest>(
    key: Key,
    value: ProcurementRequest[Key]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Purchase Request Demo</p>
        <h1>Purchase Request Intake</h1>
        <p className="hero-copy">
          Submit a purchase request and see which teams need to review it based
          on spend, contract, and data handling.
        </p>
      </section>

      <section className="workspace">
        <form className="intake-card" onSubmit={handleSubmit}>
          <div className="section-heading">
            <h2>New Purchase Request</h2>
            <p>Capture enough context to evaluate the approval path.</p>
          </div>

          <label>
            Request title
            <input
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Contract lifecycle platform"
            />
            {errors.title ? <span className="field-error">{errors.title}</span> : null}
          </label>

          <label>
            Vendor name
            <input
              value={form.vendorName}
              onChange={(event) => updateField("vendorName", event.target.value)}
              placeholder="Atlas Supply Co."
            />
            {errors.vendorName ? (
              <span className="field-error">{errors.vendorName}</span>
            ) : null}
          </label>

          <div className="grid">
            <label>
              Category
              <select
                value={form.category}
                onChange={(event) =>
                  updateField("category", event.target.value as ProcurementRequest["category"])
                }
              >
                <option value="software">Software</option>
                <option value="hardware">Hardware</option>
                <option value="services">Services</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label>
              Payment method
              <select
                value={form.paymentMethod}
                onChange={(event) =>
                  updateField(
                    "paymentMethod",
                    event.target.value as ProcurementRequest["paymentMethod"]
                  )
                }
              >
                <option value="invoice">Invoice</option>
                <option value="card">Card</option>
                <option value="wire">Wire</option>
              </select>
            </label>
          </div>

          <label>
            Amount (USD)
            <input
              type="number"
              min="0"
              value={form.amount}
              onChange={(event) => updateField("amount", Number(event.target.value))}
            />
            {errors.amount ? <span className="field-error">{errors.amount}</span> : null}
          </label>

          <label>
            Business justification
            <textarea
              value={form.justification}
              onChange={(event) => updateField("justification", event.target.value)}
              rows={4}
              placeholder="What is being requested, and why is it needed now?"
            />
            {errors.justification ? (
              <span className="field-error">{errors.justification}</span>
            ) : null}
          </label>

          <div className="toggles">
            <label className="toggle">
              <input
                type="checkbox"
                checked={form.contractRequired}
                onChange={(event) =>
                  updateField("contractRequired", event.target.checked)
                }
              />
              Contract review required
            </label>

            <label className="toggle">
              <input
                type="checkbox"
                checked={form.handlesCustomerData}
                onChange={(event) =>
                  updateField("handlesCustomerData", event.target.checked)
                }
              />
              Handles customer data
            </label>
          </div>

          <button type="submit" className="primary-action">
            {submission.status === "loading" ? "Evaluating..." : "Evaluate request"}
          </button>

          {submission.status === "error" ? (
            <p className="submit-error">{submission.message}</p>
          ) : null}
        </form>

        <aside className="result-card">
          <div className="section-heading">
            <h2>Approval outcome</h2>
            <p>Use this output to understand downstream stakeholder impact.</p>
          </div>

          {submission.status === "success" ? (
            <>
              <div
                className="risk-pill"
                data-risk={submission.data.riskLevel}
                data-testid="risk-pill"
              >
                {submission.data.riskLevel} risk
              </div>
              <p className="summary">{submission.data.summary}</p>
              <ul className="approval-list" data-testid="approval-list">
                {submission.data.approvals.map((approval) => (
                  <li key={approval}>{approval}</li>
                ))}
              </ul>
            </>
          ) : (
            <div className="empty-state">
              <p>Submit a request to preview the required approval chain.</p>
              <p>
                Larger spend triggers Finance, contract review triggers Legal,
                and customer data triggers Security.
              </p>
            </div>
          )}
        </aside>
      </section>
      <footer className="release-footer">
        <span>Release version: {deploymentVersion}</span>
        <span>Pipeline stages: validate, deploy, verify, release.</span>
      </footer>
    </main>
  );
}
