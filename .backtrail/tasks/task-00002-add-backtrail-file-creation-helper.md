# TASK-00002: Add Backtrail file creation helper

| Status | Date       | Change       | Blocked By | Blocks     |
| ------ | ---------- | ------------ | ---------- | ---------- |
| Todo   | 2026-05-06 | CHANGE-00001 | -          | TASK-00004 |

## Goal

Add reusable filesystem logic that creates `.backtrail/` and required Backtrail files without overwriting existing user files.

## Scope

- Include helper code in `apps/cli/src/` for directory creation, file creation, skipped existing files, and surfaced filesystem errors.
- Include tests for fresh init state, idempotent state, partial existing state, and filesystem failure around file creation.
- Exclude skills documentation scanning and Commander command wiring.

## Acceptance Criteria

- Missing `.backtrail/` and required files can be created.
- Existing files are preserved and reported as skipped.
- Filesystem failures are returned or thrown in a way the CLI command can map to non-zero exit behavior.

## Verification

Run:

```bash
pnpm --filter @backtrail/cli test
```

Expected result:

- File creation helper tests pass for created, skipped, partial, and failure paths.
