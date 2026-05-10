# FEATURE-00005: Exec subcommand model selection

| Status   | Date       |
| -------- | ---------- |
| Accepted | 2026-05-09 |

## Context

`backtrail exec` exposes concrete command workflows such as `exec create` and `exec implement`. Each workflow delegates to a coding agent, but different workflows need different model and reasoning-effort defaults.

Creation runs benefit from a stronger model with lower reasoning effort for artifact routing and documentation creation. Implementation runs benefit from a smaller implementation-oriented model with medium reasoning effort for code changes and verification.

Users need these defaults to be command-specific so each exec command starts with suitable runtime settings without requiring manual model flags.

## Goal

Provide command-specific default model and reasoning-effort selection for `backtrail exec` subcommands, with `exec create` using `5.5` at low reasoning effort and `exec implement` using `5.4-mini` at medium reasoning effort.

## Users / Use Cases

- Developer: runs `backtrail exec create` and gets the creation workflow on the configured creation model without extra flags.
- Developer: runs `backtrail exec implement` and gets the implementation workflow on the configured implementation model without extra flags.
- Maintainer: updates model defaults for one exec workflow without changing unrelated exec commands.

## Scope

- Define command-specific default model and reasoning-effort settings for concrete `backtrail exec` subcommands.
- Configure `backtrail exec create` to run with model `5.5` and reasoning effort `low`.
- Configure `backtrail exec implement` to run with model `5.4-mini` and reasoning effort `medium`.
- Keep existing prompt assembly, context flags, force behavior, output streaming, and error handling unchanged.
- Keep model defaults local to exec command runtime configuration so future subcommands can choose their own defaults.

## Non-Goals

- Add user-facing model or reasoning-effort override flags.
- Change non-exec CLI commands.
- Change Backtrail skill behavior or artifact schemas.
- Add provider selection, credential management, or runtime discovery.
- Change force behavior from FEATURE-00004.

## Acceptance Criteria

- Given user runs `backtrail exec create`, when the agent process is spawned, then it uses model `5.5` with reasoning effort `low`.
- Given user runs `backtrail exec implement`, when the agent process is spawned, then it uses model `5.4-mini` with reasoning effort `medium`.
- Given either command assembles prompts, when model defaults are applied, then prompt content, context flags, and force instructions remain unchanged.
- Given maintainers inspect exec command configuration, when they compare create and implement commands, then each command has an explicit model and reasoning-effort default.
- Given an exec subcommand fails, when error handling runs, then model selection does not change existing non-zero exit and error output behavior.

## Dependencies

- [FEATURE-00003](feature-00003-cli-exec-subcommands.md)
- [FEATURE-00004](feature-00004-exec-force-flag.md)
- Shared exec runtime configuration and command-specific exec subcommand modules.

## Risks / Rollback

Risk: model names may drift from provider-supported identifiers. Rollback: keep defaults centralized enough to update one command setting without changing prompt assembly or runtime execution.

Risk: command-specific defaults can become hidden behavior if not covered by tests. Rollback: add acceptance tests that validate spawned runtime arguments per subcommand.

Risk: future subcommands may copy stale defaults. Rollback: require each concrete exec subcommand to declare its own runtime defaults explicitly.

## Related Features / ADRs

- [FEATURE-00003](feature-00003-cli-exec-subcommands.md)
- [FEATURE-00004](feature-00004-exec-force-flag.md)
