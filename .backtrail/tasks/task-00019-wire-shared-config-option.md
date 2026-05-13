# TASK-00019: Wire shared config option

| Status  | Date       | Change       | Blocked By | Blocks                 |
| ------- | ---------- | ------------ | ---------- | ---------------------- |
| Todo | 2026-05-12 | CHANGE-00009 | TASK-00018 | TASK-00021, TASK-00022 |

## Goal

Wire `--config <path>` into the CLI root command workflows so config loading runs before each command's existing work.

## Scope

- Add shared `--config <path>` behavior to `init`, `create`, `implement`, and `review` command startup.
- Thread the resolved config path through command options only as needed for startup loading.
- Exclude new user-facing config settings beyond loading the JSON object.

## Acceptance Criteria

- Each public command accepts `--config <path>` without breaking existing command-specific flags.
- Config loading happens before command-specific work for create, implement, review, and init.
- Existing force/change/task/feature command behavior remains compatible.

## Verification

Run:

```bash
npm run test
```

Expected result:

- CLI tests pass for shared `--config` parsing and existing command option behavior.
