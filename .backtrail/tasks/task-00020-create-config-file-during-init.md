# TASK-00020: Create config file during init

| Status | Date       | Change       | Blocked By | Blocks     |
| ------ | ---------- | ------------ | ---------- | ---------- |
| Todo   | 2026-05-12 | CHANGE-00009 | -          | TASK-00022 |

## Goal

Update `backtrail init` output to create `.backtrail/backtrail.config.json` with `{}` when missing and preserve existing config files.

## Scope

- Add config file creation to the init file creation flow.
- Report created and skipped config file paths consistently with existing init output.
- Exclude runtime config loading and command option parsing.

## Acceptance Criteria

- Fresh `backtrail init` creates `.backtrail/backtrail.config.json` containing an empty JSON object.
- Existing config files are not overwritten and are reported as skipped.
- Existing index file creation behavior remains unchanged.

## Verification

Run:

```bash
npm run test
```

Expected result:

- Init tests pass for new config file creation, preservation of existing config, and existing index/subdir setup.
