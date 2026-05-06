# TASK-00003: Discover required Backtrail files

| Status  | Date       | Change       | Blocked By | Blocks     |
| ------- | ---------- | ------------ | ---------- | ---------- |
| Blocked | 2026-05-06 | CHANGE-00001 | TASK-00001 | TASK-00004 |

## Goal

Add narrow discovery of required Backtrail index files from `packages/skills/` documentation, with visible fallback defaults when discovery cannot find documented requirements.

## Scope

- Include scanner logic that reads relevant skill docs under `packages/skills/` to identify required `.backtrail` index files.
- Include fallback defaults only for documented required indexes such as ADR, FEATURE, CHANGE, and TASK indexes.
- Include tests proving discovery and fallback behavior.
- Exclude filesystem writes and CLI command wiring.

## Acceptance Criteria

- Required Backtrail files can be derived from skill docs where documented.
- Fallback defaults are narrow, visible, and covered by tests to avoid hard-coded drift where practical.
- Scanner output is suitable input for the file creation helper.

## Verification

Run:

```bash
pnpm --filter @backtrail/cli test
```

Expected result:

- Required-file discovery tests pass for documented discovery and fallback paths.
