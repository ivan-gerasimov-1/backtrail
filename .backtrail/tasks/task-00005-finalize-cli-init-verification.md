# TASK-00005: Finalize CLI init verification

| Status  | Date       | Change       | Blocked By | Blocks |
| ------- | ---------- | ------------ | ---------- | ------ |
| Todo | 2026-05-06 | CHANGE-00001 | TASK-00004 | -      |

## Goal

Run final verification for the completed `backtrail init` implementation and make any scoped cleanup needed to satisfy CHANGE-00001 acceptance criteria.

## Scope

- Include final execution of CLI test and typecheck gates.
- Include small scoped cleanup required by failing tests or typecheck errors from prior init tasks.
- Exclude new behavior beyond CHANGE-00001 and FEATURE-00001.

## Acceptance Criteria

- CLI init behavior satisfies fresh, idempotent, partial existing, discovery, skipped, and failure scenarios.
- CHANGE-level verification commands pass.

## Verification

Run:

```bash
pnpm --filter @backtrail/cli test
pnpm --filter @backtrail/cli build:typecheck
```

Expected result:

- Tests pass.
- Typecheck passes.
