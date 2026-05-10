# CHANGE-00007: Refactor Command Module Layout

| Status   | Date       | ADRs | Blocked By | Blocks |
| -------- | ---------- | ---- | ---------- | ------ |
| Done | 2026-05-10 | [ADR-00001](../adrs/adr-00001-command-module-layout.md) | - | - |

## Goal

Restructure CLI command modules so each command workflow owns its own directory under `apps/cli/src/commands`, while shared helpers remain in the command root.

## Scope

Included:

- Move `init` command entrypoint, tests, and private helpers into `apps/cli/src/commands/init`.
- Move `exec create`, `exec implement`, and `exec review` command entrypoints, tests, config, and private helpers into `execCreate`, `execImplement`, and `execReview` command directories.
- Keep shared command helpers and shared types in `apps/cli/src/commands` root.
- Update import paths and CLI wiring without changing public CLI behavior.

Excluded:

- Changing command behavior, flags, prompts, model defaults, or output format.
- Introducing new command workflows.
- Adding barrel-style `index` modules.

## Implementation

1. Identify command-specific files versus shared helpers under `apps/cli/src/commands`.
2. Move command-specific files into their ADR-defined workflow directories using camelCase directory names.
3. Leave shared helpers such as exec runtime/result utilities and shared types in `apps/cli/src/commands` root when used by multiple workflows.
4. Rewrite relative imports after file moves.
5. Run existing command tests and typecheck to verify behavior stays unchanged.

## Tasks

- [TASK-00010](tasks/task-00010-move-init-command-module.md)
- [TASK-00011](tasks/task-00011-move-exec-create-command-module.md)
- [TASK-00012](tasks/task-00012-move-exec-implement-command-module.md)
- [TASK-00013](tasks/task-00013-move-exec-review-command-module.md)

## Verification

Run:

```bash
npm run test
npm run typecheck
```

Expected result:

- Existing CLI command tests pass.
- Typecheck passes.
- No public CLI behavior changes.

## Rollback

Move command files back to the flat `apps/cli/src/commands` layout, restore prior import paths, and rerun tests/typecheck. Because this change is mechanical and behavior-preserving, rollback should not require data migration or user-facing compatibility work.
