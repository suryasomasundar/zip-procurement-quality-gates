import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import App from "./App";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Procurement Intake app", () => {
  it("shows validation feedback returned by the API", async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: async () => ({
          isValid: false,
          errors: {
            title: "This field is required.",
            amount: "Amount must be greater than zero."
          }
        })
      })
    );

    render(<App />);

    await user.click(screen.getByRole("button", { name: /evaluate request/i }));

    expect(
      await screen.findByText(/please fix the highlighted fields/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
  });

  it("renders the approval outcome for a valid request", async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: async () => ({
          isValid: true,
          summary:
            "Atlas Supply Co. requires Manager, Finance, Legal, Security approval with high risk.",
          approvals: ["Manager", "Finance", "Legal", "Security"],
          riskLevel: "high"
        })
      })
    );

    render(<App />);

    await user.type(
      screen.getByLabelText(/request title/i),
      "New analytics platform"
    );
    await user.type(
      screen.getByLabelText(/vendor name/i),
      "Atlas Supply Co."
    );
    await user.clear(screen.getByLabelText(/amount/i));
    await user.type(screen.getByLabelText(/amount/i), "18000");
    await user.type(
      screen.getByLabelText(/business justification/i),
      "Improve procurement visibility."
    );
    await user.click(screen.getByLabelText(/contract review required/i));
    await user.click(screen.getByLabelText(/handles customer data/i));
    await user.click(screen.getByRole("button", { name: /evaluate request/i }));

    expect(
      await screen.findByText(/^high risk$/i, { selector: "div" })
    ).toBeInTheDocument();
    expect(screen.getByText("Finance")).toBeInTheDocument();
    expect(screen.getByText("Legal")).toBeInTheDocument();
    expect(screen.getByText("Security")).toBeInTheDocument();
  });
});
