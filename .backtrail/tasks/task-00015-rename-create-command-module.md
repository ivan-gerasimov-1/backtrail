# TASK-00015: Rename create command module

| Status   | Date       | Change       | Blocked By | Blocks |
| -------- | ---------- | ------------ | ---------- | ------ |
| Done     | 2026-05-10 | [CHANGE-00008](../changes/change-00008-implement-top-level-backtrail-workflow-commands.md) | [TASK-00014](task-00014-expose-top-level-workflow-command-routing.md) | [TASK-00017](task-00017-update-workflow-command-documentation-and-verify.md) |

## Goal

Rename create workflow command files and identifiers to match the new `backtrail create` public command.

## Scope

- Move `apps/cli/src/commands/execCreate` to `apps/cli/src/commands/create`.
- Rename command-specific files and exports from `execCreate` / `execCreateConfig` shapes to `create` / `createConfig` shapes where applicable.
- Update imports in CLI wiring and create command tests.
- Keep shared `exec` runtime/helper names when they describe internal process execution.
- Exclude implement and review command module renames.

## Acceptance Criteria

- Create command module lives under `apps/cli/src/commands/create` with command-specific names matching `create`.
- `backtrail create` behavior, prompt construction, model defaults, force flag behavior, and output remain unchanged.
- No command-specific `execCreate` import path remains.

## Verification

Run:

```bash
npm run test -- --run create
npm run test -- --run cli
```

Expected result:

- Create command tests pass after module rename.
- CLI routing tests still pass with renamed create imports.
