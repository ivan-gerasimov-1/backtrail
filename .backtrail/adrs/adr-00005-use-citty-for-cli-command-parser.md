# ADR-00005: Use Citty for CLI Command Parser

| Status   | Date       |
| -------- | ---------- |
| Accepted | 2026-05-31 |

## Context

Backtrail CLI currently uses Commander to define the root command, top-level workflow commands, shared options, variadic prompt arguments, descriptions, help output, version output, and command actions.

The public CLI surface has settled around top-level commands from ADR-00002 and a shared `--config <path>` option from ADR-00003. The parser dependency now shapes how new commands are registered, how shared command options are represented, and how command tests assert behavior.

A durable dependency decision is needed before replacing the parser because this touches the CLI public contract, command registration patterns, tests, package metadata, and lockfile output.

## Decision

Backtrail CLI will use `citty` as its command parser instead of Commander.

Rules:

- `apps/cli` must depend on `citty` for CLI command definition and remove direct runtime use of Commander.
- Public command behavior must remain compatible unless a later ADR explicitly changes it.
- The root CLI must continue to expose `backtrail init`, `backtrail create`, `backtrail implement`, and `backtrail review`.
- Shared options must preserve their current public names and aliases, including `--config`, `-c/--change`, `-t/--task`, `-F/--feature`, and `-f/--force`.
- Variadic prompt argument behavior for workflow commands must remain covered by tests.
- Parser-specific code should stay near CLI command registration, not leak into command workflow modules.

## Consequences

Positive:

- Command definitions can move toward citty's object-shaped command metadata instead of chained mutable builder calls.
- Shared option metadata can be represented as plain configuration and reused more directly across commands.
- Future command registration work depends on one parser contract that is explicit in ADR history.

Negative:

- Migration must verify help text, error handling, option aliases, variadic prompt parsing, and exit behavior because citty and Commander do not parse every edge case identically.
- Tests that assert Commander-specific behavior or output will need updates.
- Package metadata and lockfile changes are required, so dependency churn is unavoidable.

## Alternatives Considered

- Keep Commander: avoids migration churn and preserves known parser behavior, but keeps the current chained builder style and does not follow the requested parser direction.
- Use another CLI parser such as `cac` or `yargs`: possible, but no current requirement favors them over citty.
- Wrap Commander behind a local abstraction first: may reduce future parser churn, but adds a local API before the actual replacement proves what abstraction is useful.

## Reversibility

This decision can be superseded by a later ADR that restores Commander or chooses another parser. Rollback requires replacing citty command registration with Commander registration, restoring Commander in `apps/cli/package.json` and `pnpm-lock.yaml`, and rerunning CLI behavior tests for commands, options, help, and variadic prompt arguments.

## Related Decisions

- [ADR-00001](adr-00001-command-module-layout.md)
- [ADR-00002](adr-00002-top-level-backtrail-workflow-commands.md)
- [ADR-00003](adr-00003-backtrail-cli-config-file.md)
