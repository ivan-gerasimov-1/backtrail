# TASK-00001: Inspect CLI init contract

| Status | Date       | Change       | Blocked By | Blocks                         |
| ------ | ---------- | ------------ | ---------- | ------------------------------ |
| Todo   | 2026-05-06 | CHANGE-00001 | -          | TASK-00002, TASK-00003         |

## Goal

Inspect the existing CLI command structure, package scripts, and test setup, then define the narrow implementation contract for `backtrail init` under CHANGE-00001.

## Scope

- Include existing files under `apps/cli/` that determine command wiring, execution, and test style.
- Include a small implementation plan for command behavior needed by later tasks.
- Exclude filesystem creation logic, skills scanning logic, command wiring changes, and final gate execution.

## Acceptance Criteria

- Existing CLI entry points and test conventions are understood before code changes.
- The implementation contract covers current working directory behavior, no-overwrite behavior, created/skipped/error reporting, and non-zero failure handling.

## Verification

Run:

```bash
pnpm --filter @backtrail/cli test
```

Expected result:

- Existing test suite baseline is known before implementation tasks proceed.
