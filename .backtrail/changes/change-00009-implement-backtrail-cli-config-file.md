# CHANGE-00009: Implement Backtrail CLI config file

| Status   | Date       | ADRs                                                        | Blocked By | Blocks |
| -------- | ---------- | ----------------------------------------------------------- | ---------- | ------ |
| Done | 2026-05-12 | [ADR-00003](../adrs/adr-00003-backtrail-cli-config-file.md) | -          | -      |

## Goal

Implement the Backtrail CLI config-file contract from ADR-00003 so workspaces can use `.backtrail/backtrail.config.json` and commands can override the path with `--config`.

## Scope

Included:

- Create `.backtrail/backtrail.config.json` with `{}` during `backtrail init` when missing.
- Load CLI configuration during command startup before command-specific work runs.
- Add shared `--config <path>` handling for commands.
- Allow missing default config files when commands can continue with defaults.
- Fail with clear errors for malformed JSON and unreadable explicit config paths.
- Update tests and documentation for generated config output and config-path behavior.

Excluded:

- New user-facing config settings beyond the empty JSON object contract.
- Non-JSON config formats.
- Migration tooling for earlier workspaces.

## Implementation

1. Add a shared config-path option and config-loading helper used by command startup.
2. Wire `init` to create `.backtrail/backtrail.config.json` without overwriting an existing file.
3. Apply default-path and explicit-path error semantics from ADR-00003.
4. Update command tests for default config absence, explicit path loading, malformed JSON, unreadable explicit paths, and init output.
5. Update CLI documentation for config file path and `--config` usage.

## Tasks

- [TASK-00018](tasks/task-00018-add-config-loader-contract.md)
- [TASK-00019](tasks/task-00019-wire-shared-config-option.md)
- [TASK-00020](tasks/task-00020-create-config-file-during-init.md)
- [TASK-00021](tasks/task-00021-cover-config-error-semantics.md)
- [TASK-00022](tasks/task-00022-update-config-documentation-and-verify.md)

## Verification

Run:

```bash
npm run test
npm run typecheck
```

Expected result:

- Init creates the config file when missing and preserves existing config files.
- Commands load valid config JSON before command-specific work.
- Missing default config files do not fail commands that can run with defaults.
- Malformed JSON and unreadable explicit config paths fail with clear messages.
- Shared `--config` behavior works across commands.

## Rollback

Remove the shared config loader and CLI option wiring, stop creating `.backtrail/backtrail.config.json` during init, and revert tests/docs that assert the ADR-00003 config behavior.
