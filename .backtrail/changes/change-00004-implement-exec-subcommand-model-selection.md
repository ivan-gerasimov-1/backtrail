# CHANGE-00004: Implement exec subcommand model selection

| Status   | Date       | ADRs | Blocked By | Blocks |
| -------- | ---------- | ---- | ---------- | ------ |
| Done | 2026-05-10 | -    | -          | -      |

## Goal

Implement command-specific model and reasoning-effort defaults for `backtrail exec create` and `backtrail exec implement` as specified by FEATURE-00005.

## Scope

Included:

- Configure `backtrail exec create` to spawn the agent with model `5.5` and reasoning effort `low`.
- Configure `backtrail exec implement` to spawn the agent with model `5.4-mini` and reasoning effort `medium`.
- Keep prompt assembly, context flags, force behavior, output streaming, and error handling unchanged.
- Add or update tests that assert spawned runtime arguments per exec subcommand.

Excluded:

- User-facing model or reasoning-effort override flags.
- Provider selection, credential management, or runtime discovery.
- Changes to Backtrail skill behavior or artifact schemas.

## Implementation

1. Locate shared exec runtime configuration and concrete `exec create` / `exec implement` command wiring.
2. Add explicit model and reasoning-effort defaults to each concrete exec subcommand configuration.
3. Pass those defaults through existing agent process spawning without changing prompt content or error handling paths.
4. Extend tests to verify `exec create` uses `5.5` with `low` and `exec implement` uses `5.4-mini` with `medium`.

## Verification

Run:

```bash
npm run test
```

Expected result:

- Exec subcommand tests pass.
- Tests verify spawned runtime arguments include command-specific model and reasoning-effort defaults.
- Existing force behavior, prompt assembly, and error handling tests remain unchanged.

## Rollback

Revert the command-specific runtime default wiring and related tests, returning both subcommands to the prior shared exec runtime defaults.
