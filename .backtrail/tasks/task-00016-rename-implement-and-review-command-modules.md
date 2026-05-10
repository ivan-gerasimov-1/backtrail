# TASK-00016: Rename implement and review command modules

| Status   | Date       | Change       | Blocked By | Blocks |
| -------- | ---------- | ------------ | ---------- | ------ |
| Todo     | 2026-05-10 | [CHANGE-00008](../changes/change-00008-implement-top-level-backtrail-workflow-commands.md) | [TASK-00014](task-00014-expose-top-level-workflow-command-routing.md) | [TASK-00017](task-00017-update-workflow-command-documentation-and-verify.md) |

## Goal

Rename implement and review workflow command files and identifiers to match the new `backtrail implement` and `backtrail review` public commands.

## Scope

- Move `apps/cli/src/commands/execImplement` to `apps/cli/src/commands/implement`.
- Move `apps/cli/src/commands/execReview` to `apps/cli/src/commands/review`.
- Rename command-specific files and exports from `execImplement` / `execReview` shapes to `implement` / `review` shapes where applicable.
- Update imports in CLI wiring, implement tests, and review tests.
- Keep shared `exec` runtime/helper names when they describe internal process execution.
- Exclude create command module rename and documentation updates.

## Acceptance Criteria

- Implement and review command modules live under `apps/cli/src/commands/implement` and `apps/cli/src/commands/review` with command-specific names matching public commands.
- `backtrail implement` and `backtrail review` behavior, prompt construction, model defaults, force flag behavior, and output remain unchanged.
- No command-specific `execImplement` or `execReview` import path remains.

## Verification

Run:

```bash
npm run test -- --run implement
npm run test -- --run review
npm run test -- --run cli
```

Expected result:

- Implement and review command tests pass after module renames.
- CLI routing tests still pass with renamed implement and review imports.
