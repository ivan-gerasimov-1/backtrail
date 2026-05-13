# TASK-00018: Add config loader contract

| Status | Date       | Change       | Blocked By | Blocks                 |
| ------ | ---------- | ------------ | ---------- | ---------------------- |
| Done | 2026-05-12 | CHANGE-00009 | -          | TASK-00019, TASK-00021 |

## Goal

Add the shared Backtrail CLI config loader and typed result contract so commands can read workspace config before command-specific work runs.

## Scope

- Add config path resolution for the default `.backtrail/backtrail.config.json` and explicit override paths.
- Add JSON parsing for the empty-object-compatible config contract.
- Exclude CLI option wiring and command action integration, which are covered by later tasks.

## Acceptance Criteria

- A shared helper exposes default-path and explicit-path loading behavior for command startup.
- Valid JSON object config files load successfully and produce a typed config value.
- Missing default config can be represented as defaults rather than failure.

## Verification

Run:

```bash
npm run test
```

Expected result:

- Config loader unit tests pass for default path resolution, explicit path resolution, valid JSON, and missing default config behavior.
