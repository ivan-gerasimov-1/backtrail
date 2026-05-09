# CHANGE-00003: Implement CLI exec subcommands

| Status   | Date       | ADRs | Blocked By | Blocks |
| -------- | ---------- | ---- | ---------- | ------ |
| Done | 2026-05-09 | -    | -          | -      |

## Goal

Implement accepted `FEATURE-00003` so `backtrail exec` becomes a parent command with explicit `implement` and `create` subcommands.

## Scope

Includes moving the current bare `backtrail exec` implementation flow to `backtrail exec implement`, keeping implementation prompt behavior and PI Coding Agent runtime semantics intact, adding `backtrail exec create` for Backtrail creation briefs, moving `-c` and `-f` options to concrete subcommands that use them, and sharing process spawning, output streaming, result collection, and error handling across exec subcommands.

Excludes adding new agent runtimes, changing model or reasoning defaults, changing PI Coding Agent process semantics, replacing Backtrail skill behavior, adding persisted exec history, adding background jobs, and changing `backtrail init`.

## Implementation

1. Inspect current `exec` command wiring, option parsing, runtime helpers, and test coverage.
2. Change bare `exec` into a router that declares explicit subcommands and no longer owns runtime-specific constants or context flags.
3. Add `exec implement` using the current implementation skill prompt, change and feature/task context options, free-form prompt text, and existing runtime behavior.
4. Add `exec create` using the Backtrail creation skill flow, change and feature context options, and free-form creation brief without the implementation skill.
5. Keep common exec runtime logic in shared helpers so subcommands do not duplicate spawn, streaming, result, or exit handling code.
6. Add tests for router behavior, `implement` prompt assembly and compatibility, `create` prompt assembly, shared runtime execution, success output, and failure paths.

## Tasks

- [TASK-00006](tasks/task-00006-extract-shared-exec-runtime-config.md)
- [TASK-00007](tasks/task-00007-add-exec-implement-subcommand.md)
- [TASK-00008](tasks/task-00008-add-exec-create-subcommand.md)
- [TASK-00009](tasks/task-00009-wire-exec-subcommand-router.md)

## Verification

Run:

```bash
pnpm --filter @backtrail/cli test
pnpm --filter @backtrail/cli build:typecheck
```

Expected result:

- Tests pass.
- Typecheck passes.
- `backtrail exec` routes only to declared exec subcommands.
- `backtrail exec implement` preserves previous implementation flow semantics.
- `backtrail exec create` invokes the Backtrail creation flow with selected context and brief text.

## Rollback

Revert the exec router changes, new subcommand modules, shared runtime prompt changes, and related tests. Restore the previous bare `backtrail exec` command behavior from `CHANGE-00002` if compatibility is required.
