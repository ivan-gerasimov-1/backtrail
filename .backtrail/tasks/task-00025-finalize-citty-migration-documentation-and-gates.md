# TASK-00025: Finalize citty migration documentation and gates

| Status  | Date       | Change       | Blocked By | Blocks |
| ------- | ---------- | ------------ | ---------- | ------ |
| Todo   | 2026-05-31 | CHANGE-00010 | TASK-00024 | -      |

## Goal

Finish CHANGE-00010 by updating affected documentation or snapshots and running the final CLI verification gates.

## Scope

- Update user-facing docs, README text, or snapshots that intentionally describe parser-shaped CLI behavior.
- Remove stale Commander references from maintained CLI docs if they become inaccurate after migration.
- Run final `@backtrail/cli` test, typecheck, and build gates.
- Confirm the implemented state satisfies ADR-00005.
- Exclude new CLI features or public contract changes.

## Acceptance Criteria

- Maintained docs and snapshots do not describe Commander-only behavior after the migration.
- Final verification confirms tests, typecheck, and build all pass for `@backtrail/cli`.
- No direct Commander runtime dependency or import remains in the CLI package.
- CHANGE-00010 can be reviewed as complete after this task.

## Verification

Run:

```bash
pnpm --filter @backtrail/cli test
pnpm --filter @backtrail/cli typecheck
pnpm --filter @backtrail/cli build
```

Expected result:

- CLI test, typecheck, and build gates pass after docs and migration cleanup are complete.
