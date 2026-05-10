# TASK-00010: Move init command module

| Status   | Date       | Change       | Blocked By | Blocks |
| -------- | ---------- | ------------ | ---------- | ------ |
| Done     | 2026-05-10 | [CHANGE-00007](../changes/change-00007-refactor-command-module-layout.md) | - | [TASK-00011](task-00011-move-exec-create-command-module.md) |

## Goal

Move the `init` command workflow into its command-owned directory without changing `backtrail init` behavior.

## Scope

- Move `apps/cli/src/commands/init.ts`, `init.test.ts`, `init.test.utils.ts`, `initDir.ts`, `initFiles.ts`, and `initSubdirs.ts` under `apps/cli/src/commands/init`.
- Update imports and CLI wiring affected by the move.
- Exclude exec workflow files and shared command-root helpers.

## Acceptance Criteria

- `init` command-specific implementation, tests, and private helpers live under `apps/cli/src/commands/init`.
- Shared files used outside the init workflow remain in `apps/cli/src/commands` root.
- Public `backtrail init` behavior, flags, generated files, and output remain unchanged.

## Verification

Run:

```bash
npm run test -- --run init
npm run typecheck
```

Expected result:

- Init command tests pass.
- Typecheck passes.
