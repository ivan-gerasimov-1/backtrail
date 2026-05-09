# TASK-00007: Add exec implement subcommand

| Status  | Date       | Change       | Blocked By | Blocks     |
| ------- | ---------- | ------------ | ---------- | ---------- |
| Done | 2026-05-09 | CHANGE-00003 | TASK-00006 | TASK-00009 |

## Goal

Move the existing bare `backtrail exec` implementation flow into an `exec implement` command module while preserving prompt assembly and PI Coding Agent execution semantics.

## Scope

- Include an `exec implement` command function, implementation skill prompt ownership, `-c` change context, `-t` task context, free-form prompt text, and tests for prompt compatibility.
- Include use of the shared runtime helper from `TASK-00006`.
- Exclude creation flow behavior and top-level CLI router wiring left for separate TASK records.

## Acceptance Criteria

- `exec implement` assembles the same implementation prompt previously produced by bare `exec` for change, task, and free-form prompt inputs.
- `exec implement` uses the shared runtime helper instead of local process spawning or duplicated output/error handling.
- Tests prove prompt compatibility with the previous implementation flow and optional context behavior.

## Verification

Run:

```bash
pnpm --filter @backtrail/cli test
pnpm --filter @backtrail/cli build:typecheck
```

Expected result:

- Tests pass.
- Typecheck passes.
