# TASK-00006: Extract shared exec runtime config

| Status | Date       | Change       | Blocked By | Blocks                 |
| ------ | ---------- | ------------ | ---------- | ---------------------- |
| Todo   | 2026-05-09 | CHANGE-00003 | -          | TASK-00007, TASK-00008 |

## Goal

Extract exec runtime configuration so concrete exec subcommands can share process spawning, output streaming, result collection, and failure handling without duplicating runtime code.

## Scope

- Include shared exec request types, prompt argument construction, runtime options, and tests around spawn arguments, success output, non-zero exits, spawn failures, and PI config-dir failures.
- Include only reusable behavior required by `exec implement` and `exec create`.
- Exclude CLI router wiring and subcommand-specific skill prompt behavior left for later TASK records.

## Acceptance Criteria

- Shared runtime accepts a subcommand-provided prompt or flow configuration while preserving current PI Coding Agent binary, model, output streaming, and error mapping behavior.
- Runtime tests cover success, captured output, spawn failure, non-zero exit, and config directory permission failure through the shared helper.
- No implementation or creation skill constants remain coupled to generic runtime spawning.

## Verification

Run:

```bash
pnpm --filter @backtrail/cli test
pnpm --filter @backtrail/cli build:typecheck
```

Expected result:

- Tests pass.
- Typecheck passes.
