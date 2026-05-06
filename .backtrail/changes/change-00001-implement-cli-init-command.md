# CHANGE-00001: Implement CLI init command

| Status   | Date       | ADRs | Blocked By | Blocks |
| -------- | ---------- | ---- | ---------- | ------ |
| Proposed | 2026-05-06 | -    | -          | -      |

## Goal

Implement the accepted `FEATURE-00001` CLI init command so users can bootstrap Backtrail files from `apps/cli/`.

## Scope

Includes adding the `init` command, filesystem creation for `.backtrail`, discovery of required Backtrail files from `packages/skills/`, no-overwrite behavior, clear CLI output, and tests for success, skip, and error paths.

Excludes implementing artifact creation workflows, migrations, semantic validation of existing Backtrail content, and destructive reset behavior.

## Implementation

1. Inspect existing CLI command structure and tests.
2. Add an `init` command under `apps/cli/src/cli.ts` or a small command module if needed.
3. Add filesystem logic to create `.backtrail/` and required files without overwriting existing files.
4. Scan `packages/skills/` docs for required Backtrail file/index requirements, with narrow fallback defaults only if documented scanning cannot find a requirement.
5. Print created/skipped/error results and set non-zero exit behavior on failure.
6. Add Vitest coverage for fresh init, idempotent init, partial existing state, and filesystem failure.

## Tasks

- [TASK-00001](tasks/task-00001-inspect-cli-init-contract.md)
- [TASK-00002](tasks/task-00002-add-backtrail-file-creation-helper.md)
- [TASK-00003](tasks/task-00003-discover-required-backtrail-files.md)
- [TASK-00004](tasks/task-00004-wire-cli-init-command.md)
- [TASK-00005](tasks/task-00005-finalize-cli-init-verification.md)

## Verification

Run:

```bash
pnpm --filter @backtrail/cli test
pnpm --filter @backtrail/cli build:typecheck
```

Expected result:

- Tests pass.
- Typecheck passes.
- `backtrail init` creates `.backtrail` and required files without overwriting existing files.

## Rollback

Revert CLI command, helper modules, and tests. Users can remove newly created `.backtrail` files manually because init must avoid overwriting existing content.

## Related Features

- [FEATURE-00001](../features/feature-00001-cli-init-command.md)
