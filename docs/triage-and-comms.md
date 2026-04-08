# Triage And Communication

## Triage workflow

When a check fails:

1. Confirm which signal failed: lint, typecheck, unit, integration, E2E, coverage, audit, CodeQL, or secret scan.
2. Determine scope: PR-only, `master` branch, nightly regression, or deployed environment.
3. Assign the component owner from [`ownership.md`](/Users/somu-cookunity/Documents/zip/docs/ownership.md).
4. Capture evidence: failing logs, artifacts, traces, screenshots, or SARIF/code scanning output.
5. Decide disposition:
   - product defect
   - test defect
   - flaky test
   - dependency / infrastructure issue
   - configuration drift

## Slack message templates

### PR failure

```text
[CI] PR quality gate failed
PR: <link>
Author: <name>
Failed check: <lint/unit/integration/e2e/etc>
Owner: <component owner>
Next step: investigate and update PR before merge
```

### Main branch failure

```text
[Urgent] Main branch is red
Workflow: <link>
Failed check: <name>
Suspected scope: <frontend/api/domain/platform>
Owner: <name>
Action: pause merges until quality gate is restored
```

### Nightly regression failure

```text
[Nightly] Regression failure detected
Workflow: <link>
Failure area: <name>
Impact: does not block active PRs unless reproduced on master
Owner: <name>
Action: triage in next business window and create issue if confirmed
```

### Security finding

```text
[Security] Repository scan reported a finding
Source: <audit/codeql/gitleaks>
Workflow: <link>
Owner: <security/platform/component owner>
Action: assess severity, rotate secrets if needed, and track remediation
```

## Failure triage template

```text
Failure summary:
Environment:
Workflow link:
First seen:
Component owner:
Severity:
User or release impact:
Evidence:
Likely cause:
Immediate mitigation:
Longer-term fix:
```

## Failure report template

Use this for any major quality gate incident that affects `master`, release validation, or team velocity.

```text
Title:
Date:
Owner:
Affected workflow:

Summary:
Impact:
Timeline:
Root cause:
Detection method:
Resolution:
Corrective actions:
Prevention actions:
Status:
```

## Self-healing suggestions

These are recommended next-step automations, not fully implemented in this take-home:

- automatic retry for known transient workflow failures
- flaky test quarantine label and dashboard
- automatic rollback to the previous blue/green color after failed deploy-smoke validation
- automatic artifact retention and summarization for failed nightly runs
- Slack notifications only for `master`, nightly, and security failures to reduce noise
