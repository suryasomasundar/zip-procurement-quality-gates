# Component Ownership

This document defines ownership at the component and process level so failures can be routed quickly and consistently.

## Ownership model

| Area | Suggested owner | Responsibilities |
| --- | --- | --- |
| Frontend (`apps/web`) | Frontend engineer | UI behavior, user workflows, Playwright selectors, UI integration tests |
| API (`apps/api`) | Backend engineer | API contracts, request handling, API integration tests |
| Domain rules (`packages/domain`) | QA / quality engineer | approval routing logic, validation rules, unit coverage |
| CI workflows (`.github/workflows`) | Platform / DevOps or QA automation | workflow reliability, CI performance, secret management |
| Documentation (`docs`) | QA manager / engineering manager | process clarity, stakeholder communication, training material |

## Primary escalation path

1. Workflow owner triages the failed signal.
2. Component owner investigates the underlying defect.
3. QA owner determines whether the issue is product, test, or infrastructure related.
4. Engineering manager decides whether the issue blocks merges or can be mitigated temporarily.

## Merge blocking guidance

Treat the following as merge-blocking by default:

- broken `master` branch quality gates
- reproducible unit or integration failures
- security audit failures with actionable vulnerabilities
- CodeQL findings that indicate exploitable risk
- release or deploy-smoke failures for promoted environments

Temporary exceptions should require explicit engineering manager approval and a tracked follow-up item.
