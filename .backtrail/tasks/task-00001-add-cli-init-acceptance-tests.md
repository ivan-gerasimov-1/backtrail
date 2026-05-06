# TASK-00001: Add CLI init acceptance tests

| Status | Date       | Change       | Blocked By | Blocks     |
| ------ | ---------- | ------------ | ---------- | ---------- |
| Todo   | 2026-05-06 | CHANGE-00001 | -          | TASK-00004 |

## Goal

Add executable CLI acceptance tests that define the required `backtrail init` behavior before implementation wiring.

## Scope

- Include Vitest coverage in `apps/cli/src/` for fresh init, idempotent init, partial existing state, and filesystem failure behavior.
- Include assertions for current working directory behavior, no-overwrite behavior, created/skipped/error reporting, and non-zero failure handling.
- Exclude filesystem helper implementation, required-file discovery implementation, and command implementation beyond test scaffolding needs.

## Acceptance Criteria

- Tests encode the user-visible `backtrail init` contract from CHANGE-00001 and FEATURE-00001.
- Tests fail against the current CLI until later implementation tasks provide the behavior.
- Test files are concrete project artifacts and become the executable contract for later tasks.

## Verification

Run:

```bash
pnpm --filter @backtrail/cli test
```

Expected result:

- New CLI init acceptance tests run and fail only because implementation is not complete yet.
