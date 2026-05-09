# TASK-00009: Wire exec subcommand router

| Status  | Date       | Change       | Blocked By            | Blocks |
| ------- | ---------- | ------------ | --------------------- | ------ |
| Done | 2026-05-09 | CHANGE-00003 | TASK-00007, TASK-00008 | -      |

## Goal

Change CLI `exec` into a parent command that routes only to declared `implement` and `create` subcommands with their own options and shared result handling.

## Scope

- Include CLI parser wiring for `backtrail exec`, `backtrail exec implement`, and `backtrail exec create`.
- Include moving `-c`, `-t`, and `-f` options to the subcommands that use them, preserving actionable error output and non-zero exit behavior.
- Include CLI tests for router registration, option ownership, implement invocation, create invocation, success output, and failure paths.
- Exclude adding compatibility aliases, new runtimes, background jobs, persisted history, or changes to `backtrail init`.

## Acceptance Criteria

- Bare `backtrail exec` behaves as a parent command and routes only to declared exec subcommands.
- `backtrail exec implement` invokes the implementation command with change, task, and prompt inputs.
- `backtrail exec create` invokes the creation command with change, feature, and brief inputs.
- CLI failure handling sets `process.exitCode = 1` and prints each runtime error with the existing `error ` prefix.
- Tests cover router behavior, option ownership, both subcommand invocations, and failure paths.

## Verification

Run:

```bash
pnpm --filter @backtrail/cli test
pnpm --filter @backtrail/cli build:typecheck
```

Expected result:

- Tests pass.
- Typecheck passes.
