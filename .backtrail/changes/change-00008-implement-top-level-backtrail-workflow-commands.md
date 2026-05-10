# CHANGE-00008: Implement Top-Level Backtrail Workflow Commands

| Status   | Date       | ADRs | Blocked By | Blocks |
| -------- | ---------- | ---- | ---------- | ------ |
| Proposed | 2026-05-10 | [ADR-00002](../adrs/adr-00002-top-level-backtrail-workflow-commands.md) | - | - |

## Goal

Expose Backtrail workflow commands as top-level CLI commands so users run `backtrail create`, `backtrail implement`, and `backtrail review` without the `exec` namespace.

## Scope

Included:

- Register `create`, `implement`, and `review` as top-level CLI commands.
- Remove `exec` as the public command namespace for Backtrail workflow commands.
- Rename command module directories and command-specific files from `execCreate`, `execImplement`, and `execReview` to `create`, `implement`, and `review` shapes where applicable.
- Update imports, tests, snapshots/fixtures if present, documentation, and examples that reference `backtrail exec create`, `backtrail exec implement`, or `backtrail exec review`.
- Keep shared execution helpers named with `exec` only when they describe internal process execution rather than public command routing.

Excluded:

- Adding compatibility aliases for `backtrail exec ...`.
- Changing workflow prompts, model defaults, force flag behavior, or spawned agent execution semantics.
- Introducing new workflow commands beyond `create`, `implement`, and `review`.

## Implementation

1. Update CLI command registration to expose top-level `create`, `implement`, and `review` commands.
2. Remove the `exec` command router and public `exec` subcommand wiring.
3. Move command-specific modules and tests into `apps/cli/src/commands/create`, `apps/cli/src/commands/implement`, and `apps/cli/src/commands/review`.
4. Rename command-specific identifiers, imports, test descriptions, and fixtures so they match the new public command names.
5. Update user-facing docs and examples to use the top-level command forms.
6. Run tests and typecheck to confirm the new CLI surface works and old public namespace is absent.

## Tasks

- [TASK-00014](tasks/task-00014-expose-top-level-workflow-command-routing.md)
- [TASK-00015](tasks/task-00015-rename-create-command-module.md)
- [TASK-00016](tasks/task-00016-rename-implement-and-review-command-modules.md)
- [TASK-00017](tasks/task-00017-update-workflow-command-documentation-and-verify.md)

## Verification

Run:

```bash
npm run test
npm run typecheck
```

Expected result:

- CLI tests pass for `backtrail create`, `backtrail implement`, and `backtrail review`.
- Tests verify `backtrail exec` is no longer the public workflow namespace.
- Typecheck passes after command module renames.
- Documentation/examples no longer advertise `backtrail exec ...` workflow commands.

## Rollback

Restore the `exec` command router and prior `execCreate`, `execImplement`, and `execReview` module paths, revert docs/examples to `backtrail exec ...`, then rerun tests and typecheck. No data migration is required.
