# TASK-00024: Cover citty CLI behavior

| Status | Date       | Change       | Blocked By | Blocks     |
| ------ | ---------- | ------------ | ---------- | ---------- |
| Todo   | 2026-05-31 | CHANGE-00010 | TASK-00023 | TASK-00025 |

## Goal

Update CLI behavior tests so the `citty` parser migration preserves the public command and option contract from ADR-00005.

## Scope

- Update or add CLI tests for `backtrail init`, `backtrail create`, `backtrail implement`, and `backtrail review` routing.
- Cover shared `--config <path>` handling under the migrated parser.
- Cover workflow option aliases: `-c/--change`, `-t/--task`, `-F/--feature`, and `-f/--force`.
- Cover variadic prompt argument forwarding for workflow commands.
- Cover help and version behavior enough to catch incompatible parser output or exit behavior.
- Exclude dependency metadata changes and parser rewrite work covered by TASK-00023.
- Exclude final documentation cleanup and full release gates covered by TASK-00025.

## Acceptance Criteria

- Tests fail if public command names or documented option aliases are removed.
- Tests fail if workflow prompt parts are not forwarded as ordered arguments.
- Tests fail if config loading no longer honors explicit `--config <path>`.
- Tests reflect parser-compatible help/version behavior without asserting irrelevant Commander-specific formatting.

## Verification

Run:

```bash
pnpm --filter @backtrail/cli test
```

Expected result:

- CLI tests pass and cover command routing, aliases, config loading, help/version behavior, and variadic prompt forwarding under `citty`.
