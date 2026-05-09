# FEATURE-00003: CLI exec subcommands

| Status   | Date       |
| -------- | ---------- |
| Accepted | 2026-05-09 |

## Context

`backtrail exec` currently runs one predefined coding-agent execution flow directly from the top-level `exec` command. That keeps the first execution workflow short, but it leaves no clear command space for adjacent Backtrail agent flows.

Users now need `exec` to become a subcommand router. Current implementation behavior should move under `exec implement`, and a new `exec create` flow should run Backtrail creation through the same CLI surface.

The CLI should keep runtime-specific constants, skill prompts, `-c`, and `-f` options attached to concrete subcommands instead of the parent router.

## Goal

Provide `backtrail exec` as a parent command that routes to explicit subcommands, with existing implementation behavior preserved under `backtrail exec implement` and new Backtrail artifact creation behavior exposed through `backtrail exec create`.

## Users / Use Cases

- Developer: runs `backtrail exec implement` with change/task context and prompt text to execute an implementation flow.
- Developer: runs `backtrail exec create` with a creation brief to delegate Backtrail artifact creation through the CLI.
- Maintainer: adds or updates exec subcommands without duplicating agent runtime spawning, option parsing, or result handling logic across command implementations.

## Scope

- Change bare `backtrail exec` into a subcommand router.
- Move current `backtrail exec` behavior to `backtrail exec implement`.
- Move the implementation skill prompt currently represented by `EXEC_SKILL` to the `implement` subcommand scope.
- Move `-c` and `-f` options from parent `exec` scope to subcommands that use them.
- Add `backtrail exec create` that uses the Backtrail creation flow under the hood.
- Preserve current implementation execution semantics for `exec implement`, including PI Coding Agent runtime, predefined model, print behavior, prompt assembly, output streaming, and error handling.
- Share common exec runtime logic across subcommands so command implementations do not duplicate spawning, output collection, or exit handling.

## Non-Goals

- Add new coding-agent runtimes beyond PI Coding Agent.
- Change the predefined model, reasoning effort, print behavior, or process execution semantics for implementation runs.
- Replace Backtrail skill behavior or create Backtrail artifacts directly in CLI code.
- Add multi-agent orchestration, background jobs, or persisted exec history.
- Change `backtrail init` behavior.

## Acceptance Criteria

- Given the CLI is installed, when user runs `backtrail exec`, then the command behaves as a parent command and routes only to declared exec subcommands.
- Given user runs `backtrail exec implement`, when the command starts, then it performs the same implementation flow previously available through bare `backtrail exec`.
- Given user runs `backtrail exec implement` with `-c`, `-f`, and prompt text, when prompt assembly happens, then change context, task or feature context, implementation skill, and free-form prompt are included in the spawned agent request.
- Given user runs `backtrail exec create` with a creation brief, when the command starts, then it invokes the Backtrail creation flow through the configured agent runtime.
- Given user runs `backtrail exec create` with `-c`, `-f`, and prompt text, when prompt assembly happens, then the create flow receives the selected context and free-form brief without using the implementation skill.
- Given any exec subcommand spawns the agent, when runtime execution is needed, then common runtime helper logic is used instead of duplicating process spawning, output streaming, and exit handling in each command.
- Given a subcommand spawn or agent execution fails, when the command handles the failure, then it exits non-zero and prints actionable error output.

## Dependencies

- [FEATURE-00002](feature-00002-cli-exec-command.md)
- `apps/cli/` command structure and argument parser.
- Runtime capability for spawning PI Coding Agent.
- Existing Backtrail creation skill flow.

## Risks / Rollback

Risk: moving behavior from bare `exec` to `exec implement` can break existing user commands. Rollback: keep the parent command change narrow and document the new explicit subcommand path; if needed, restore a compatibility alias in a later change.

Risk: shared runtime helper can become too generic if it tries to model future workflows. Rollback: extract only process spawning, output streaming, result collection, and error mapping used by current subcommands.

Risk: `exec create` may blur responsibility between CLI and Backtrail skills. Rollback: keep CLI behavior limited to assembling and running the creation skill request, with artifact decisions remaining inside Backtrail creation skills.

## Related Features / ADRs

- [FEATURE-00002](feature-00002-cli-exec-command.md)
