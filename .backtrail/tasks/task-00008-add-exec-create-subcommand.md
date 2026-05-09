# TASK-00008: Add exec create subcommand

| Status  | Date       | Change       | Blocked By | Blocks     |
| ------- | ---------- | ------------ | ---------- | ---------- |
| Done | 2026-05-09 | CHANGE-00003 | TASK-00006 | TASK-00009 |

## Goal

Add an `exec create` command module that runs the Backtrail creation flow through the configured PI Coding Agent runtime.

## Scope

- Include a creation command function, Backtrail creation skill prompt ownership, `-c` change context, `-f` feature context, free-form creation brief text, and tests for prompt assembly.
- Include use of the shared runtime helper from `TASK-00006`.
- Exclude implementation skill behavior and top-level CLI router wiring left for separate TASK records.

## Acceptance Criteria

- `exec create` assembles a Backtrail creation request that includes selected change context, feature context, and free-form brief text.
- `exec create` does not include the implementation skill prompt.
- `exec create` uses the shared runtime helper instead of local process spawning or duplicated output/error handling.
- Tests prove creation prompt assembly with and without optional context.

## Verification

Run:

```bash
pnpm --filter @backtrail/cli test
pnpm --filter @backtrail/cli build:typecheck
```

Expected result:

- Tests pass.
- Typecheck passes.
