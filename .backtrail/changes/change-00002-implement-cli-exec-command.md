# CHANGE-00002: Implement CLI exec command

| Status   | Date       | ADRs | Blocked By | Blocks |
| -------- | ---------- | ---- | ---------- | ------ |
| Done     | 2026-05-09 | -    | -          | -      |

## Goal

Implement the accepted `FEATURE-00002` CLI exec command so users can run the predefined coding-agent execution flow from `apps/cli/`.

## Scope

Includes adding the `exec` command at the same CLI level as `init`, accepting separate change and task names plus free-form prompt text, spawning one PI Coding Agent instance with the predefined model, prompt, reasoning effort, and print flag, waiting for completion, printing the agent result, and returning non-zero exit behavior on spawn or execution failure.

Excludes CLI flags for custom model, prompt, reasoning effort, or print behavior, support for other coding-agent runtimes, multi-agent orchestration, background or daemon execution, persisted job state, and direct creation or mutation of Backtrail records from `backtrail exec`.

## Implementation

1. Inspect current CLI command structure and test coverage.
2. Add an `exec` command beside `init` in the CLI entrypoint with `--change`, `--task`, and free-form prompt text support.
3. Wire a narrow runtime module that spawns PI Coding Agent with the predefined execution settings and assembled prompt text.
4. Wait for agent completion and print result output.
5. Surface actionable errors and non-zero exit behavior for spawn failures and agent failures.
6. Add Vitest coverage for command wiring, prompt assembly, spawn behavior, success output, and failure paths.

## Verification

Run:

```bash
pnpm --filter @backtrail/cli test
pnpm --filter @backtrail/cli build:typecheck
```

Expected result:

- Tests pass.
- Typecheck passes.
- `backtrail exec` is available beside `backtrail init` and reports agent results or actionable errors.

## Rollback

Revert `exec` command wiring, runtime module, and tests. `init` stays unchanged.
