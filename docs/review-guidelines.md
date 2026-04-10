# Review Guidelines

## Purpose

This document defines the working agreement for pull requests: when a change is ready for review, how it should be communicated, who should review it, how quickly reviews should happen, and what must be addressed before merge.

GitHub is the system of record for review state, approvals, comments, and required checks. Slack is the attention and escalation channel.

## Branch and pull request standards

### Branch naming

Feature branches should be created from `master` and use an approved naming pattern such as:

- `feature/<change>`
- `fix/<change>`
- `chore/<change>`
- `docs/<change>`
- `release/<change>`
- `hotfix/<change>`

### Pull request title

PR titles should follow the ticket-first format:

- `QA-1234: concise summary`

### Pull request body

The PR template is expected to include:

- `## Change Summary`
- `## High-Level Validation`
- `## Change Area Checklist`
- `## Risk Review`
- a ticket field such as ``Ticket: `QA-1234` ``

## Definition of ready for review

A pull request should be marked ready for review only when:

- the branch name follows the required convention
- the PR title and ticket reference are valid
- the PR template is fully completed
- the scope and intent of the change are understandable
- validation performed is listed clearly
- risk areas are called out honestly
- screenshots or evidence are included when the UI changes
- deployment or rollback notes are included when release behavior changes

Draft PRs are encouraged when the author wants early feedback but the change is not yet ready for merge evaluation.

## How to communicate that a PR is ready

### Source of truth

The GitHub PR thread is the source of truth for:

- review comments
- approvals
- required checks
- merge blockers
- final disposition

### Attention channel

A dedicated Slack channel such as `#team-prs` or `<team-name>-prs` should be used to notify reviewers that a PR is ready.

When the PR is ready for review, the author should post a short message containing:

- PR title and ticket
- PR link
- change area
- risk level
- requested reviewers
- whether checks are green or still running
- target merge timing if relevant

Example:

```text
PR ready for review: QA-1234: Harden PR governance and refresh repo docs
Area: CI / governance
Risk: Low
Reviewers requested: @qa-owner @platform-owner
Checks: Running
Target merge: Today EOD
PR: <link>
```

If the change is urgent, release-blocking, or production-impacting, the author should also notify the team engineering channel in addition to the PR channel.

## Reviewer routing

Reviewers should be selected intentionally based on the affected area:

- `apps/web`: frontend or product-facing reviewer
- `apps/api`: backend or API reviewer
- `packages/domain`: domain logic or QA owner
- `.github/workflows`, `render.yaml`, Docker, release files: platform or infrastructure reviewer
- security-sensitive changes: security-aware reviewer

CODEOWNERS helps reinforce path-based ownership, but the author should still request the most appropriate human reviewers directly.

## Review expectations

### Author responsibilities

The author is responsible for:

- opening a clear and reviewable PR
- describing what changed and why
- identifying risk areas
- requesting the right reviewers
- responding to feedback quickly
- making sure required checks pass before merge
- coordinating with the right partners if failures are outside their area

### Reviewer responsibilities

Reviewers are responsible for:

- checking correctness first
- identifying regression risk
- calling out missing tests or weak validation
- distinguishing blocking comments from non-blocking suggestions
- keeping feedback actionable and specific

Review feedback should prioritize:

1. correctness
2. business or user impact
3. regression risk
4. missing validation
5. maintainability
6. style and cleanup

When leaving comments, reviewers should make the status clear:

- `Blocking`: must be addressed before merge
- `Non-blocking`: should be considered, but does not prevent approval
- `Suggestion`: optional improvement

## Review SLA

### Standard expectations

- first review response within 4 business hours
- urgent or release-blocking changes acknowledged within 1 business hour
- authors respond to blocking feedback the same business day when practical
- PRs that remain unreviewed for more than 1 business day should be escalated

### Escalation path

If a review is delayed or blocked:

1. the author pings the primary reviewer in the PR
2. if there is no response within SLA, the author escalates in the PR Slack channel
3. if the change affects deployment, CI, release, or security behavior, include the relevant QA or platform owner early
4. if the delay continues, escalate to the team lead or engineering manager

## Cross-team coordination expectations

Authors are expected to move the PR forward, even when the issue spans teams.

Examples:

- if tests fail because of product behavior changes, coordinate with the QA owner
- if environment or deployment checks fail, coordinate with the platform or infrastructure owner
- if security scans fail, involve the security-aware owner
- if approval-routing logic changes, involve the domain or business-aware reviewer
- if a check is flaky, document it clearly and do not silently bypass it

## Merge conflict handling

Because the repository uses linear history with squash and rebase merge methods, the preferred conflict resolution path is:

1. rebase the feature branch on top of the latest `master`
2. resolve conflicts locally
3. rerun relevant validation
4. push the updated branch
5. request re-review if the conflict resolution changed behavior materially

Avoid resolving important conflicts casually in the GitHub web editor when the conflicts touch:

- domain rules
- workflows
- deployment configuration
- security-sensitive files

## Merge ownership

The PR author may merge once:

- required checks pass
- required approval is present
- conversations are resolved
- no blocking feedback remains open

For workflow, deployment, release, or security-impacting changes, the relevant owner should review before merge.

Emergency fixes may be merged by the incident owner or engineering lead under the team’s incident process.

## What must be addressed before merge

Before merge, a PR must address:

- all failing required checks
- all blocking review comments
- all unresolved conversations
- missing validation for changed behavior
- deployment or release concerns for workflow-affecting changes

## AI-assisted review

AI-assisted review can be used as an optional early signal for:

- missing tests
- workflow drift
- suspicious release or infrastructure changes
- branch protection mismatches
- security or deployment concerns

AI review should be treated as advisory, not authoritative:

- human reviewers remain responsible for approval and merge judgment
- actionable AI findings should be confirmed
- confirmed findings should be fixed or explicitly addressed in the PR

## Recommended future improvements

- automatic reviewer routing by changed file path
- label-based release risk classification
- SLA tracking dashboard for review latency
- flaky-test tracking and quarantine workflow
- Slack notification automation for ready-for-review, broken `master`, and failed release validation
