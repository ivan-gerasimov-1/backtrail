# FEATURE-00006: Exec review subcommand

| Status   | Date       |
| -------- | ---------- |
| Implemented | 2026-05-10 |

## Context

`backtrail exec` already exposes explicit subcommands for creating Backtrail artifacts and implementing Backtrail work through PI Coding Agent. Users also need a CLI workflow that delegates implementation review to the existing Backtrail review skill without manually composing the skill invocation, model, reasoning effort, and safety instruction each time.

The review workflow should fit the existing exec command pattern: concrete subcommand, shared runtime execution, command-specific model defaults, printed agent result, and non-zero failures with actionable error output.

## Goal

Provide `backtrail exec review` as a user-visible command that runs the `backtrail-review` skill through PI Coding Agent with model `5.5` and low reasoning effort.

## Users / Use Cases

- Developer: runs `backtrail exec review` with change, task, feature, and/or prompt context to review implemented Backtrail work from the terminal.
- Maintainer: uses one explicit review command with stable runtime defaults instead of manually invoking the review skill and model options.
- Reviewer: passes `--force` when review should proceed from available context while preserving explicit safety and Backtrail skill guardrails.

## Scope

- Add `backtrail exec review` as a concrete exec subcommand.
- Invoke the `backtrail-review` skill through the existing PI Coding Agent exec runtime.
- Configure the review subcommand to use model `5.5` and reasoning effort `low`.
- Accept relevant context flags consistent with review needs, including change, task, feature, free-form prompt text, and force behavior where supported by existing exec workflows.
- Reuse shared exec runtime behavior for process spawning, output collection, printed result handling, and non-zero failure handling.
- Preserve explicit safety and Backtrail skill guardrails when force mode is used.

## Non-Goals

- Implement review logic inside CLI code.
- Create or mutate Backtrail ADR, FEATURE, CHANGE, or TASK records directly from the CLI command.
- Add user-facing model, provider, or reasoning-effort override flags.
- Change existing `exec create` or `exec implement` behavior.
- Add multi-agent review orchestration, persisted review history, or background jobs.

## Acceptance Criteria

- Given the CLI is installed, when user runs `backtrail exec review`, then the command is recognized as an exec subcommand.
- Given user runs `backtrail exec review` with change, task, feature, and/or prompt context, when prompt assembly happens, then the spawned agent request includes the `backtrail-review` skill and supplied context.
- Given `backtrail exec review` spawns the agent process, when runtime arguments are built, then model `5.5` and reasoning effort `low` are used.
- Given user passes force mode to `backtrail exec review`, when prompt assembly happens, then the force instruction tells the review workflow not to ask user questions while preserving explicit safety and Backtrail skill guardrails.
- Given the review agent completes successfully, when the command finishes, then the completed agent result is printed as command output.
- Given spawning or review execution fails, when the command handles the failure, then it exits non-zero and prints actionable error output consistent with existing exec subcommands.

## Dependencies

- [FEATURE-00003](feature-00003-cli-exec-subcommands.md)
- [FEATURE-00005](feature-00005-exec-subcommand-model-selection.md)
- Existing shared exec runtime configuration and result handling.
- Existing `backtrail-review` skill.

## Risks / Rollback

Risk: review command may imply CLI-owned review semantics instead of skill-owned review behavior. Rollback: keep CLI limited to skill invocation and remove the subcommand without changing review artifacts.

Risk: model identifier or reasoning-effort support may drift. Rollback: keep review runtime defaults explicit and local to the review subcommand so they can be changed without affecting create or implement.

Risk: force mode could suppress useful reviewer clarification. Rollback: preserve explicit safety and Backtrail guardrail language in the force prompt and allow users to omit force for clarification-friendly review runs.

## Related Features / ADRs

- [FEATURE-00003](feature-00003-cli-exec-subcommands.md)
- [FEATURE-00005](feature-00005-exec-subcommand-model-selection.md)
