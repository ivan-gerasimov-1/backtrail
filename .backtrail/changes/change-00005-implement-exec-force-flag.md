# CHANGE-00005: Implement exec force flag

| Status   | Date       | ADRs | Blocked By | Blocks |
| -------- | ---------- | ---- | ---------- | ------ |
| Done | 2026-05-10 | -    | -          | -      |

## Goal

Implement FEATURE-00004 by adding `--force` / `-f` to concrete `backtrail exec` commands so spawned agent prompts instruct agents to avoid clarification questions and proceed using available context.

## Scope

Included:

- Add `--force` and `-f` option parsing to concrete `backtrail exec` subcommands.
- Add shared force prompt instruction during exec prompt assembly when force is enabled.
- Preserve existing exec runtime behavior, model selection, reasoning effort, output handling, and error handling.
- Cover force behavior with tests for long flag, short flag, no-force behavior, and composition with context flags and prompt text.

Excluded:

- Changing default exec behavior when force is not supplied.
- Bypassing safety confirmations or Backtrail skill guardrails.
- Adding force behavior outside `backtrail exec` commands.

## Implementation

1. Locate shared exec option parsing and prompt assembly for `implement` and `create` subcommands.
2. Add a boolean force option with `--force` and `-f` aliases to every concrete exec subcommand.
3. Define one shared force instruction that tells the agent to avoid asking clarification questions and proceed with available context while preserving explicit safety and skill guardrails.
4. Include the force instruction only when force is enabled, alongside existing context and user prompt text.
5. Add or update tests for long flag, short flag, no-force behavior, and prompt composition.

## Verification

Run:

```bash
npm run test
```

Expected result:

- Exec force tests pass.
- Existing exec subcommand behavior remains unchanged when force is omitted.

## Rollback

Remove the force option from exec subcommands and remove the force instruction from prompt assembly. Revert related tests.

## Related

- [FEATURE-00004](../features/feature-00004-exec-force-flag.md)
