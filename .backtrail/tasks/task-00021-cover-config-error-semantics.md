# TASK-00021: Cover config error semantics

| Status  | Date       | Change       | Blocked By             | Blocks     |
| ------- | ---------- | ------------ | ---------------------- | ---------- |
| Blocked | 2026-05-12 | CHANGE-00009 | TASK-00018, TASK-00019 | TASK-00022 |

## Goal

Add command-level behavior and tests for ADR-00003 error semantics around malformed JSON, unreadable explicit config paths, and missing default config files.

## Scope

- Fail with clear errors for malformed config JSON.
- Fail with clear errors for unreadable explicit config paths.
- Allow missing default config files when commands can continue with defaults.
- Exclude init config file generation and documentation updates.

## Acceptance Criteria

- Malformed config JSON produces a non-successful command result with a clear error message.
- Explicit unreadable or missing config path fails clearly.
- Missing default `.backtrail/backtrail.config.json` does not fail commands that can run with defaults.

## Verification

Run:

```bash
npm run test
```

Expected result:

- Command and loader tests pass for malformed JSON, unreadable explicit paths, missing explicit paths, and missing default path fallback.
