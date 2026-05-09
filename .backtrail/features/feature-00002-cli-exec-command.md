# FEATURE-00002: CLI exec command

| Status   | Date       |
| -------- | ---------- |
| Implemented | 2026-05-09 |

## Context

The CLI currently exposes `backtrail init` for project setup. Users also need a CLI workflow that delegates a fixed Backtrail execution prompt plus change/task context to a coding agent and returns the agent result through the command output.

In the first phase, `backtrail exec` should use PI Coding Agent as the coding-agent runtime.

The command should sit at the same CLI level as `init` so users can run it as `backtrail exec` without entering a nested workflow.

## Goal

Provide a user-visible `backtrail exec` command that runs a predefined coding-agent execution flow, accepts separate change and task names plus optional free-form prompt text, and prints the completed agent result as the command output.

## Users / Use Cases

- Developer: runs `backtrail exec` in a repository, passes change/task context and prompt text, and receives the final coding-agent result in the terminal.
- Maintainer: updates the predefined execution prompt, model, or reasoning effort in implementation when Backtrail execution behavior needs to change.

## Scope

- Add an `exec` command beside the existing `init` command in the CLI.
- When run, accept separate change and task names plus optional free-form prompt text.
- Spawn one PI Coding Agent instance using implementation-defined model, prompt, and reasoning effort values.
- Spawn the agent with the print flag enabled.
- Wait for the agent to finish.
- Print the completed agent result as the command output.
- Return a non-zero exit code with actionable error output when spawning or execution fails.

## Non-Goals

- Add CLI flags to customize model, prompt, reasoning effort, or print behavior.
- Add support for coding-agent runtimes beyond PI Coding Agent.
- Add multi-agent orchestration.
- Add background execution, daemon behavior, or persisted job state.
- Create or mutate Backtrail ADR, FEATURE, CHANGE, or TASK records directly from `backtrail exec`.
- Replace the existing `backtrail init` command behavior.

## Acceptance Criteria

- Given the CLI is installed, when user runs `backtrail exec`, then the command is recognized at the same level as `backtrail init`.
- Given `backtrail exec` starts successfully, when the coding agent is spawned, then it uses PI Coding Agent with the predefined model, predefined prompt, predefined reasoning effort, print flag, and assembled change/task/prompt text.
- Given the coding agent completes successfully, when `backtrail exec` finishes, then the agent result is printed as the command output.
- Given the coding agent spawn fails, when `backtrail exec` handles the failure, then the command exits non-zero and prints actionable error output.
- Given the coding agent returns a failure result, when `backtrail exec` handles the result, then the command exits non-zero and prints actionable error output without hiding the agent failure.

## Dependencies

- `apps/cli/` command structure and argument parser.
- Runtime capability for spawning PI Coding Agent.
- Stable predefined model, prompt, reasoning effort, and print flag values in implementation.

## Risks / Rollback

Risk: hard-coded prompt/model values may become stale or hard to audit. Rollback: keep predefined values in one visible module with tests around command wiring, then revert the CLI command without affecting `init`.

Risk: first-phase PI Coding Agent coupling may need replacement later. Rollback: keep provider-specific spawning behind one narrow implementation module so a later provider change does not require CLI command contract changes.

Risk: agent execution may hang or produce large output. Rollback: implementation should preserve normal process interruption behavior and avoid persisted state so users can stop the command without cleanup.

## Related Features / ADRs

- [FEATURE-00001](feature-00001-cli-init-command.md)
