# TASK-00022: Update config documentation and verify

| Status  | Date       | Change       | Blocked By             | Blocks |
| ------- | ---------- | ------------ | ---------------------- | ------ |
| Blocked | 2026-05-12 | CHANGE-00009 | TASK-00020, TASK-00021 | -      |

## Goal

Update CLI documentation for the config file contract and run final verification for CHANGE-00009.

## Scope

- Document `.backtrail/backtrail.config.json`, `{}` default contents, and `--config <path>` usage.
- Update any command help or README references needed for the public config contract.
- Run final test and typecheck gates for the full change.

## Acceptance Criteria

- Documentation explains default config path, init-created file, and explicit path override behavior.
- Verification confirms config behavior across init and workflow commands.
- CHANGE-00009 remains scoped to ADR-00003 with no new config settings added.

## Verification

Run:

```bash
npm run test
npm run typecheck
```

Expected result:

- Full test suite and typecheck pass after config file behavior and docs are complete.
