# TASK-00012: Move exec implement command module

| Status   | Date       | Change       | Blocked By | Blocks |
| -------- | ---------- | ------------ | ---------- | ------ |
| Done  | 2026-05-10 | [CHANGE-00007](../changes/change-00007-refactor-command-module-layout.md) | [TASK-00011](task-00011-move-exec-create-command-module.md) | [TASK-00013](task-00013-move-exec-review-command-module.md) |

## Goal

Move the `exec implement` workflow into its command-owned directory while preserving existing implement execution behavior.

## Scope

- Move `apps/cli/src/commands/execImplement.ts` and `execImplement.test.ts` under `apps/cli/src/commands/execImplement`.
- Update imports and CLI wiring affected by the move.
- Keep shared exec runtime/result/config helpers in `apps/cli/src/commands` root when still used by multiple workflows.
- Exclude `exec create`, `exec review`, and init workflow files.

## Acceptance Criteria

- `exec implement` entrypoint and tests live under `apps/cli/src/commands/execImplement`.
- Shared exec helpers are not duplicated into the command directory.
- Public `backtrail exec implement` behavior, prompts, model defaults, flags, and output remain unchanged.

## Verification

Run:

```bash
npm run test -- --run execImplement
npm run typecheck
```

Expected result:

- Exec implement command tests pass.
- Typecheck passes.
