# ADR-00002: Top-Level Backtrail Workflow Commands

| Status   | Date       |
| -------- | ---------- |
| Accepted | 2026-05-10 |

## Context

Backtrail CLI workflow commands currently sit behind an `exec` command namespace, such as `backtrail exec create`, `backtrail exec implement`, and `backtrail exec review`. The implementation also mirrors that namespace through command directory and file names like `execCreate`, `execImplement`, and `execReview`.

The `exec` prefix no longer describes the user intent as well as the workflow names themselves. Users choose between creating Backtrail records, implementing a change, or reviewing a change. Keeping `exec` as a root command adds an extra routing layer and couples command names to an implementation detail: spawning a coding-agent execution flow.

## Decision

Expose Backtrail workflow commands as top-level CLI commands:

- `backtrail create`
- `backtrail implement`
- `backtrail review`

Remove the `backtrail exec` root command and do not keep `exec` as the primary namespace for these workflows.

Command modules and command-specific files should use names that match the public workflow command without the `exec` prefix:

- `apps/cli/src/commands/create/...`
- `apps/cli/src/commands/implement/...`
- `apps/cli/src/commands/review/...`

Shared execution helpers may keep `exec` in their names only when they describe the internal process-running mechanism rather than a public command namespace.

## Consequences

Positive:

- CLI surface matches user intent and removes an unnecessary command layer.
- Command directories align with public command names.
- Future workflow commands can be added without nesting under an implementation-oriented namespace.

Negative:

- Documentation and examples that mention `exec` need updates.

## Alternatives Considered

- Keep `backtrail exec ...`: avoids compatibility churn, but preserves an implementation-oriented namespace and extra command layer.
- Add top-level aliases while keeping `exec` as primary: reduces migration friction, but leaves two supported surfaces and weakens the intended contract.

## Reversibility

This decision is reversible through a follow-up ADR that restores an execution namespace or introduces compatibility aliases. Rollback requires restoring command registration, directory names, import paths, tests, and documentation. If users adopt top-level commands, rollback should include a compatibility window.

## Related Decisions

- [ADR-00001](adr-00001-command-module-layout.md)
