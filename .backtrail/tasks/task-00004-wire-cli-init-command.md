# TASK-00004: Wire CLI init command

| Status  | Date       | Change       | Blocked By                         | Blocks     |
| ------- | ---------- | ------------ | ---------------------------------- | ---------- |
| Blocked | 2026-05-06 | CHANGE-00001 | TASK-00001, TASK-00002, TASK-00003 | TASK-00005 |

## Goal

Wire `backtrail init` into the CLI so it discovers required files, creates missing Backtrail files, reports created/skipped/error states, and exits non-zero on failure.

## Scope

- Include Commander command registration in `apps/cli/src/cli.ts` or a small command module.
- Include integration-style CLI tests for success, skipped existing files, partial existing state, and filesystem failure output.
- Include clear stdout/stderr behavior for created, skipped, and error results.
- Exclude changing artifact creation workflows or adding destructive reset behavior.

## Acceptance Criteria

- `backtrail init` creates `.backtrail` and required files in the current working directory.
- Existing files are not overwritten and skipped files are reported.
- File creation failure causes actionable error output and non-zero exit behavior.

## Verification

Run:

```bash
pnpm --filter @backtrail/cli test
pnpm --filter @backtrail/cli build:typecheck
```

Expected result:

- CLI init tests pass.
- Typecheck passes.
