# TASK-00023: Add citty parser dependency and command registration

| Status | Date       | Change       | Blocked By | Blocks     |
| ------ | ---------- | ------------ | ---------- | ---------- |
| Todo   | 2026-05-31 | CHANGE-00010 | -          | TASK-00024 |

## Goal

Replace Commander-based CLI registration with `citty` command definitions while preserving the public command surface required by ADR-00005.

## Scope

- Add `citty` as the exact CLI parser dependency for `@backtrail/cli`.
- Remove Commander as a direct runtime dependency when no longer used.
- Update lockfile metadata for the dependency swap.
- Rewrite `apps/cli/src/cli.ts` so parser-specific command metadata and action handling use `citty`.
- Preserve `backtrail init`, `backtrail create`, `backtrail implement`, and `backtrail review` command actions.
- Keep command workflow modules independent from parser-specific types and argument shapes.
- Exclude test coverage expansion and documentation cleanup left for later TASK records.

## Acceptance Criteria

- `apps/cli/src/cli.ts` no longer imports or instantiates Commander.
- `apps/cli` depends on `citty` and no longer lists Commander as a direct runtime dependency.
- Existing command handlers still load config before command execution.
- Workflow commands still pass prompt parts and command options into their existing workflow modules.
- No new public command or option names are introduced.

## Verification

Run:

```bash
pnpm --filter @backtrail/cli typecheck
```

Expected result:

- Typecheck passes with `citty` command registration and no direct Commander runtime use.
