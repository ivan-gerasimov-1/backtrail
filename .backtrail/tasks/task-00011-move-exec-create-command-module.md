# TASK-00011: Move exec create command module

| Status   | Date       | Change       | Blocked By | Blocks |
| -------- | ---------- | ------------ | ---------- | ------ |
| Done  | 2026-05-10 | [CHANGE-00007](../changes/change-00007-refactor-command-module-layout.md) | [TASK-00010](task-00010-move-init-command-module.md) | [TASK-00012](task-00012-move-exec-implement-command-module.md) |

## Goal

Move the `exec create` workflow into its command-owned directory while preserving existing create execution behavior.

## Scope

- Move `apps/cli/src/commands/execCreate.ts`, `execCreate.test.ts`, and `execCreateConfig.ts` under `apps/cli/src/commands/execCreate`.
- Update imports and CLI wiring affected by the move.
- Keep shared exec runtime/result/config helpers in `apps/cli/src/commands` root when still used by multiple workflows.
- Exclude `exec implement`, `exec review`, and init workflow files.

## Acceptance Criteria

- `exec create` entrypoint, config, and tests live under `apps/cli/src/commands/execCreate`.
- Shared exec helpers are not duplicated into the command directory.
- Public `backtrail exec create` behavior, prompts, model defaults, flags, and output remain unchanged.

## Verification

Run:

```bash
npm run test -- --run execCreate
npm run typecheck
```

Expected result:

- Exec create command tests pass.
- Typecheck passes.
