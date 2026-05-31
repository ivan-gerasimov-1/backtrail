# CHANGE-00010: Replace Commander with citty for CLI parser

| Status   | Date       | ADRs                                                               | Blocked By | Blocks |
| -------- | ---------- | ------------------------------------------------------------------ | ---------- | ------ |
| Done | 2026-05-31 | [ADR-00005](../adrs/adr-00005-use-citty-for-cli-command-parser.md) | -          | -      |

## Goal

Replace the Backtrail CLI command parser dependency from Commander to `citty` while preserving the public command and option contract defined by existing accepted ADRs.

## Scope

Included:

- Replace `apps/cli` runtime command parsing from Commander to `citty`.
- Update `apps/cli/package.json` and the lockfile so `citty` is the CLI parser dependency and Commander is no longer a direct runtime dependency.
- Preserve the public `backtrail init`, `backtrail create`, `backtrail implement`, and `backtrail review` command surface.
- Preserve shared and workflow option names and aliases, including `--config`, `-c/--change`, `-t/--task`, `-F/--feature`, and `-f/--force`.
- Update tests and documentation that assert parser-specific command behavior.

Excluded:

- Introducing new public commands or option names.
- Changing command workflow module contracts beyond what is needed to keep parser-specific code near CLI registration.
- Changing the Backtrail config file contract from ADR-00003.

## Implementation

1. Add `citty` as an exact dependency for `@backtrail/cli` and remove the direct Commander runtime dependency.
2. Rewrite CLI command registration in `apps/cli/src/cli.ts` using `citty` command metadata and action handlers.
3. Keep workflow command modules independent from parser-specific types and argument shapes.
4. Preserve config loading before command execution, including explicit `--config <path>` behavior and default config fallback.
5. Preserve prompt part forwarding for workflow commands.
6. Update CLI tests for command routing, option aliases, config behavior, help/version behavior, and variadic prompt arguments.
7. Update any user-facing docs or snapshots that intentionally describe parser-shaped CLI behavior.

## Tasks

- [TASK-00023](tasks/task-00023-add-citty-parser-dependency-and-command-registration.md)
- [TASK-00024](tasks/task-00024-cover-citty-cli-behavior.md)
- [TASK-00025](tasks/task-00025-finalize-citty-migration-documentation-and-gates.md)

## Verification

Run:

```bash
pnpm --filter @backtrail/cli test
pnpm --filter @backtrail/cli typecheck
pnpm --filter @backtrail/cli build
```

Expected result:

- CLI command tests pass with `citty` as the parser.
- Typecheck and build pass without Commander imports or direct runtime dependency.
- Public commands, aliases, config loading, help/version behavior, and variadic prompt forwarding remain compatible with ADR-00005.

## Rollback

Restore the Commander dependency and lockfile entries, restore the previous Commander-based CLI registration, remove `citty` if no longer used, and rerun the CLI test, typecheck, and build gates.
