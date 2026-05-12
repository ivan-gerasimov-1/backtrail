# ADR-00003: Backtrail CLI Config File

| Status   | Date       |
| -------- | ---------- |
| Accepted | 2026-05-11 |

## Context

Backtrail CLI currently relies on built-in command defaults and workspace files under `.backtrail`. There is no durable place for workspace-level CLI settings, and commands do not share a public way to override that settings location.

The requested behavior adds `.backtrail/backtrail.config.json`, loads it when the CLI starts, creates it during `backtrail init`, and lets commands accept a config path with `--config` / `-c`. This changes the public CLI contract and the generated workspace output, so the contract should be recorded before implementation.

## Decision

Backtrail CLI will use a JSON config file as the workspace-level configuration contract.

Rules:

- Default config path is `.backtrail/backtrail.config.json` resolved from the current working directory.
- `backtrail init` creates `.backtrail/backtrail.config.json` with an empty JSON object (`{}`) when it does not already exist.
- The CLI loads configuration during command startup before command-specific work runs.
- Commands accept `--config <path>` to override the config file path.
- Config file absence outside `init` is allowed only when command behavior can continue with defaults; malformed JSON or unreadable explicit config paths should fail with a clear error.

## Consequences

Positive:

- Workspace-level settings get a stable, discoverable location.
- Init output matches runtime expectations.
- A shared `--config` contract makes command behavior easier to document and extend.

Negative:

- Config loading adds startup failure modes around JSON parsing and path access.
- Tests and documentation need updates for generated files and command option parsing.

## Alternatives Considered

- Keep only built-in defaults: avoids new file and parsing behavior, but leaves no durable workspace config contract.
- Use a non-JSON format: may be nicer for comments, but adds parser choice and dependency surface without current need.

## Reversibility

This decision can be superseded by a later ADR that removes config loading or changes the config format/path. Rollback must preserve compatibility for existing generated `.backtrail/backtrail.config.json` files or document a migration window.

## Related Decisions

- [ADR-00002](adr-00002-top-level-backtrail-workflow-commands.md)
