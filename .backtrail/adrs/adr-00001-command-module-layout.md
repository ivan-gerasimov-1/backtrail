# ADR-00001: Command Module Layout

| Status   | Date       |
| -------- | ---------- |
| Accepted | 2026-05-10 |

## Context

CLI command code currently lives mostly as flat files under `apps/cli/src/commands`. As command count grows (`init`, `exec create`, `exec implement`, `exec review`) command-specific runtime code, config, tests, and helpers share one directory with cross-command helpers. This makes ownership and file placement less obvious.

A durable repository layout rule is needed before refactoring so future command work follows the same structure.

## Decision

Each CLI command workflow gets its own directory under `apps/cli/src/commands`.

Rules:

- Command-specific entrypoints, config, tests, and private helpers live in their command directory, for example `commands/init/...`, `commands/execCreate/...`, `commands/execImplement/...`, and `commands/execReview/...`.
- `apps/cli/src/commands` root contains only shared command code and helper modules used by multiple command directories.
- Imports from outside `commands` should target command directory public entrypoints or shared root helpers, not private implementation files when avoidable.
- New command workflows should follow this layout unless a later ADR supersedes it.

## Consequences

Positive:

- Command ownership becomes visible from directory structure.
- Command-specific tests and helpers stay close to implementation.
- Shared helpers become easier to identify because they remain in the `commands` root.

Negative:

- Refactor touches many import paths without changing behavior.
- Directory-per-command can add small boilerplate for tiny commands.
- Boundary between shared helper and command-private helper needs code review discipline.

## Alternatives Considered

- Keep flat `commands` directory: lowest immediate churn, but command-specific and shared modules remain mixed.
- Group only `exec` subcommands under one `commands/exec` tree: reduces duplication for exec flows, but conflicts with the requested command-per-workflow ownership and can hide per-subcommand boundaries.

## Reversibility

This decision is reversible through a follow-up ADR and mechanical file moves/import rewrites. Public CLI behavior should not change, so rollback mainly requires restoring prior paths and running tests/typecheck.
