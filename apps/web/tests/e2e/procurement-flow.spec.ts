import { expect, test } from "@playwright/test";

test("submits a low-risk request and shows a manager-only route", async ({
  page
}) => {
  await page.goto("/");

  await page.getByLabel("Request title").fill("Laptop refresh");
  await page.getByLabel("Vendor name").fill("Acme Devices");
  await page.getByLabel("Amount (USD)").fill("2500");
  await page
    .getByLabel("Business justification")
    .fill("Replace aging employee laptops.");
  await page.getByRole("button", { name: "Evaluate request" }).click();

  await expect(page.getByTestId("risk-pill")).toHaveText("low risk");
  await expect(page.getByTestId("approval-list")).toContainText("Manager");
});

test("routes a high-risk request to Finance, Legal, and Security", async ({
  page
}) => {
  await page.goto("/");

  await page.getByLabel("Request title").fill("Customer data warehouse");
  await page.getByLabel("Vendor name").fill("Atlas Supply Co.");
  await page.getByLabel("Amount (USD)").fill("18000");
  await page
    .getByLabel("Business justification")
    .fill("Centralize spend and supplier intelligence.");
  await page.getByLabel("Contract review required").check();
  await page.getByLabel("Handles customer data").check();
  await page.getByRole("button", { name: "Evaluate request" }).click();

  await expect(page.getByTestId("risk-pill")).toHaveText("high risk");
  await expect(page.getByTestId("approval-list")).toContainText("Finance");
  await expect(page.getByTestId("approval-list")).toContainText("Legal");
  await expect(page.getByTestId("approval-list")).toContainText("Security");
});
