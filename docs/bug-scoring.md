# Bug Scoring Model

This scoring model helps leadership see whether quality is improving or degrading over time without relying only on raw bug counts.

## Severity weights

| Severity | Definition | Weight |
| --- | --- | --- |
| Critical | Production outage, security exposure, or release blocker | 10 |
| High | Major workflow breakage, high customer impact, or broken `master` | 6 |
| Medium | Partial workflow degradation or repeated nightly/PR failures | 3 |
| Low | Cosmetic issue, low-risk defect, or non-blocking test failure | 1 |

## Score calculation

Weekly bug score can be calculated as:

`sum(open bug weights) + sum(open flaky test weights / 2)`

Example:

- 1 Critical bug = 10
- 2 High bugs = 12
- 3 Medium bugs = 9
- 4 Low bugs = 4
- 2 Medium flaky tests = 3

Total bug score = `38`

## How to use it

- Track score at the start and end of each week.
- Use the trend, not only the raw number.
- Pair score with release health and `master` branch stability.

## Suggested leadership thresholds

- `0-10`: healthy
- `11-25`: watch closely
- `26-40`: elevated risk
- `40+`: leadership attention required

## Recommended companion metrics

- PR failure rate
- `master` branch red time
- nightly regression failure count
- flaky test count
- median time to restore broken quality gates
