# FEATURE-00004: Exec force flag

| Status   | Date       |
| -------- | ---------- |
| Accepted | 2026-05-09 |

## Context

`backtrail exec` subcommands delegate Backtrail workflows to a coding agent. Some workflows can pause when the agent asks clarifying questions before acting. Users need an explicit CLI override for runs where they want the agent to avoid questions and proceed with implementation or artifact creation based on available context.

The flag should be available across all concrete `exec` commands so forced behavior is consistent for implementation and creation flows.

## Goal

Provide a user-visible `--force` / `-f` flag on all `backtrail exec` commands that adds a force instruction to the spawned agent prompt, telling the agent not to ask user questions and to proceed with the requested work.

## Users / Use Cases

- Developer: runs `backtrail exec implement --force` to make the agent continue implementation without stopping for clarification.
- Developer: runs `backtrail exec create --force` to make the agent write the appropriate Backtrail artifact without asking user questions.
- Maintainer: keeps force prompt behavior consistent across exec subcommands while preserving existing runtime handling.

## Scope

- Add `--force` and `-f` to every concrete `backtrail exec` subcommand.
- When force is enabled, insert an additional prompt instruction into the agent request.
- The force instruction commands the agent to avoid asking user questions and proceed with the requested implementation or creation workflow using available context.
- Keep existing `exec` subcommand runtime behavior, output handling, model selection, reasoning effort, and error handling unchanged.
- Ensure force behavior composes with existing context flags and free-form prompt text.

## Non-Goals

- Change default behavior when `--force` is not supplied.
- Bypass safety checks, destructive-operation confirmations, or Backtrail skill guardrails that explicitly require confirmation.
- Add interactive prompts to the CLI before invoking the agent.
- Add force behavior outside `backtrail exec` commands.
- Add runtime provider customization.

## Acceptance Criteria

- Given user runs any concrete `backtrail exec` command with `--force`, when the agent prompt is assembled, then it includes an instruction to avoid asking user questions and proceed with the requested work.
- Given user runs any concrete `backtrail exec` command with `-f`, when the agent prompt is assembled, then it behaves the same as `--force`.
- Given user runs an exec command without force, when the agent prompt is assembled, then no force instruction is added.
- Given user combines force with context flags and prompt text, when the agent prompt is assembled, then all selected context, the force instruction, and the user prompt are preserved.
- Given a force-enabled agent run encounters skill or safety guardrails that require confirmation, when the agent handles the request, then those guardrails remain authoritative over the force instruction.

## Dependencies

- [FEATURE-00003](feature-00003-cli-exec-subcommands.md)
- `apps/cli/` exec subcommand option parsing.
- Shared exec prompt assembly and runtime invocation modules.

## Risks / Rollback

Risk: force wording may encourage unsafe behavior if interpreted too broadly. Rollback: scope the prompt instruction to avoiding clarification questions only, while preserving explicit safety and skill guardrails.

Risk: subcommands may drift if force is added separately to each command. Rollback: keep the force prompt text in shared exec configuration or helper code and reuse it across subcommands.

Risk: `-f` may conflict with an existing exec option. Rollback: verify current subcommand options before implementation and choose a compatible flag only if no conflict exists.

## Related Features / ADRs

- [FEATURE-00003](feature-00003-cli-exec-subcommands.md)
