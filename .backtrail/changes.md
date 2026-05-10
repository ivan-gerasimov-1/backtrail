# Backtrail Changes

| Change | Status | Date | ADRs | Blocked By | Blocks | Title / Summary |
| ------ | ------ | ---- | ---- | ---------- | ------ | --------------- |
| [CHANGE-00001](changes/change-00001-implement-cli-init-command.md) | Done | 2026-05-06 | - | - | - | Implement CLI init command — bootstrap `.backtrail` files from skill requirements. |
| [CHANGE-00002](changes/change-00002-implement-cli-exec-command.md) | Done | 2026-05-09 | - | - | - | Implement CLI exec command — run predefined PI Coding Agent flow and print result. |
| [CHANGE-00003](changes/change-00003-implement-cli-exec-subcommands.md) | Done | 2026-05-09 | - | - | - | Implement CLI exec subcommands — route exec workflows through explicit implement and create subcommands. |
| [CHANGE-00004](changes/change-00004-implement-exec-subcommand-model-selection.md) | Done | 2026-05-10 | - | - | - | Implement exec subcommand model selection — apply command-specific model and reasoning-effort defaults for exec create and implement. |
| [CHANGE-00005](changes/change-00005-implement-exec-force-flag.md) | Done | 2026-05-10 | - | - | - | Implement exec force flag — add --force / -f to exec commands and include a force instruction in spawned agent prompts. |
| [CHANGE-00006](changes/change-00006-implement-exec-review-subcommand.md) | Done | 2026-05-10 | - | - | - | Implement exec review subcommand — add `backtrail exec review` using the review skill with model 5.5 and low reasoning effort. |
| [CHANGE-00007](changes/change-00007-refactor-command-module-layout.md) | Done | 2026-05-10 | [ADR-00001](adrs/adr-00001-command-module-layout.md) | - | - | Refactor command module layout — move CLI command workflow files into command-owned directories per ADR-00001. |
| [CHANGE-00008](changes/change-00008-implement-top-level-backtrail-workflow-commands.md) | Done | 2026-05-10 | [ADR-00002](adrs/adr-00002-top-level-backtrail-workflow-commands.md) | - | - | Implement top-level Backtrail workflow commands — expose create, implement, and review as top-level commands per ADR-00002. |
